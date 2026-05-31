import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  productToFavoriteItem,
  sanitizeFavoriteItems,
} from "@/lib/favorites/helpers";
import type { FavoriteItem, FavoriteProductInput } from "@/lib/favorites/types";

interface FavoritesState {
  items: FavoriteItem[];
  addFavorite: (product: FavoriteProductInput) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: FavoriteProductInput) => boolean;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

function parsePersistedState(persisted: unknown): FavoriteItem[] {
  if (!persisted || typeof persisted !== "object") return [];

  const state = persisted as {
    items?: unknown;
    favoriteIds?: unknown;
  };

  const fromItems = sanitizeFavoriteItems(state.items);
  if (fromItems.length > 0) return fromItems;

  if (Array.isArray(state.favoriteIds)) {
    return [];
  }

  if (Array.isArray(state.items) && state.items.length > 0) {
    return [];
  }

  return [];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      addFavorite: (product) => {
        if (get().isFavorite(product.id)) return;
        set((s) => ({
          items: [productToFavoriteItem(product), ...sanitizeFavoriteItems(s.items)],
        }));
      },

      removeFavorite: (productId) =>
        set((s) => ({
          items: sanitizeFavoriteItems(s.items).filter(
            (i) => i.productId !== productId
          ),
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
        sanitizeFavoriteItems(get().items).some((i) => i.productId === productId),

      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: "le-maia-favorites",
      version: 2,
      migrate: (persisted) => {
        try {
          return { items: parsePersistedState(persisted) };
        } catch {
          return { items: [] };
        }
      },
      partialize: (state) => ({
        items: sanitizeFavoriteItems(state.items),
      }),
    }
  )
);

/** Contagem para badge na navegação */
export function useFavoriteCount() {
  return useFavoritesStore((s) => (s.items ?? []).length);
}
