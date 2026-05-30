"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button, Card, ProductCard, Typography, toast } from "@/design-system";
import {
  favoriteItemToProduct,
  sanitizeFavoriteItems,
} from "@/lib/favorites/helpers";
import { ROUTES } from "@/lib/constants/routes";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useCartStore } from "@/store/useCartStore";

function selectFavoriteItems(state: { items?: unknown }) {
  return sanitizeFavoriteItems(state.items ?? []);
}

export function FavoritesView() {
  const items = useFavoritesStore(selectFavoriteItems);
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <Card
        variant="default"
        padding="lg"
        className="flex flex-col items-center text-center"
      >
        <Heart className="h-12 w-12 text-maia-rose" strokeWidth={1.25} />
        <Typography variant="body-sm" className="mt-4 text-maia-muted">
          Você ainda não salvou nenhuma bolsa.
        </Typography>
        <Typography variant="caption" className="mt-1 text-maia-muted">
          Toque no coração nos produtos para guardar aqui.
        </Typography>
        <Link href={ROUTES.catalog} className="mt-6 w-full max-w-xs">
          <Button variant="primary" fullWidth>
            Explorar catálogo
          </Button>
        </Link>
      </Card>
    );
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
