"use client";

import { ProductCard, toast } from "@/design-system";
import {
  favoriteItemToProduct,
  sanitizeFavoriteItems,
} from "@/lib/favorites/helpers";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useCartStore } from "@/store/useCartStore";
import { FavoritesEmptyState } from "./FavoritesEmptyState";

function selectFavoriteItems(state: { items?: unknown }) {
  try {
    return sanitizeFavoriteItems(state.items ?? []);
  } catch {
    return [];
  }
}

export function FavoritesView() {
  const items = useFavoritesStore(selectFavoriteItems);
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return <FavoritesEmptyState />;
  }

  return (
    <div>
      <p className="mb-5 rounded-2xl bg-maia-nude/60 px-4 py-3 text-sm text-maia-muted">
        {items.length === 1
          ? "1 peça na sua seleção"
          : `${items.length} peças na sua seleção`}
      </p>

      <ul className="product-grid" role="list" aria-label="Produtos favoritos">
        {items.map((item, index) => {
          const product = favoriteItemToProduct(item);

          return (
            <li key={item.productId} className="list-none">
              <ProductCard
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                cloudinaryPublicId={product.cloudinaryPublicId}
                categoryName={product.category?.name}
                priority={index < 2}
                onBuy={() => {
                  addItem(product);
                  toast.success("Adicionado ao carrinho");
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
