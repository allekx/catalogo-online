import { create } from "zustand";
import { persist } from "zustand/middleware";
import { productToFavoriteItem } from "@/lib/favorites/helpers";
import type { FavoriteItem, FavoriteProductInput } from "@/lib/favorites/types";
interface FavoritesState {
  items: FavoriteItem[];
  addFavorite: (product: FavoriteProductInput) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: FavoriteProductInput) => boolean;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

/** Formato antigo (só IDs) — descartado; favoritos precisam de dados do produto real */
function migrateLegacyIds(_favoriteIds: string[]): FavoriteItem[] {
  return [];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      addFavorite: (product) => {
        if (get().isFavorite(product.id)) return;
        set((s) => ({
          items: [productToFavoriteItem(product), ...s.items],
        }));
      },

      removeFavorite: (productId) =>
        set((s) => ({
          items: s.items.filter((i) => i.productId !== productId),
        })),

      toggleFavorite: (product) => {
        const wasFavorite = get().isFavorite(product.id);
        if (wasFavorite) {
          get().removeFavorite(product.id);
          return false;
        }
        get().addFavorite(product);
        return true;
      },

      isFavorite: (productId) =>
        get().items.some((i) => i.productId === productId),

      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: "le-maia-favorites",
      version: 1,
      migrate: (persisted) => {
        const state = persisted as {
          items?: FavoriteItem[];
          favoriteIds?: string[];
        };
        if (state?.items?.length) return { items: state.items };
        if (state?.favoriteIds?.length) {
          return { items: migrateLegacyIds(state.favoriteIds) };
        }
        return { items: [] };
      },
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/** Contagem para badge na navegação */
export function useFavoriteCount() {
  return useFavoritesStore(
    (s) => s.items.filter((i) => !i.productId.startsWith("mock-")).length
  );
}
