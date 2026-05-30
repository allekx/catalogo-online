import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/products/types";
import { getItemSubtotal } from "@/lib/cart/format";

interface CartState {
  items: CartItem[];
  itemCount: number;
  addItem: (
    product: Product,
    options?: { quantity?: number; observations?: string }
  ) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateObservations: (productId: string, observations: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: (productId: string) => number;
}

function syncCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

function productToCartItem(
  product: Product,
  quantity: number,
  observations?: string
): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    cloudinaryPublicId: product.cloudinaryPublicId,
    categoryName: product.category?.name ?? "Coleção",
    quantity,
    observations,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,

      addItem: (product, options) => {
        const qty = Math.max(1, options?.quantity ?? 1);
        const observations = options?.observations?.trim();

        set((s) => {
          const existing = s.items.find((i) => i.productId === product.id);
          let items: CartItem[];

          if (existing) {
            items = s.items.map((i) =>
              i.productId === product.id
                ? {
                    ...i,
                    quantity: i.quantity + qty,
                    categoryName:
                      i.categoryName ?? product.category?.name ?? "Coleção",
                    observations: observations ?? i.observations,
                  }
                : i
            );
          } else {
            items = [
              ...s.items,
              productToCartItem(product, qty, observations),
            ];
          }

          return { items, itemCount: syncCount(items) };
        });
      },

      removeItem: (productId) =>
        set((s) => {
          const items = s.items.filter((i) => i.productId !== productId);
          return { items, itemCount: syncCount(items) };
        }),

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((s) => {
          const items = s.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          );
          return { items, itemCount: syncCount(items) };
        });
      },

      updateObservations: (productId, observations) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId ? { ...i, observations } : i
          ),
        })),

      clearCart: () => set({ items: [], itemCount: 0 }),

      getTotal: () =>
        get().items.reduce(
          (sum, i) => sum + getItemSubtotal(i.price, i.quantity),
          0
        ),

      getSubtotal: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (!item) return 0;
        return getItemSubtotal(item.price, item.quantity);
      },
    }),
    {
      name: "le-maia-cart",
      partialize: (state) => ({
        items: state.items.map((i) => ({
          ...i,
          categoryName: i.categoryName ?? "Coleção",
        })),
        itemCount: state.itemCount,
      }),
    }
  )
);
