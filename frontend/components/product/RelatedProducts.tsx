"use client";

import Link from "next/link";
import { ProductCard } from "@/design-system";
import { ROUTES } from "@/lib/constants/routes";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "@/design-system";
import type { Product } from "@/lib/products/types";

interface RelatedProductsProps {
  products: Product[];
  currentSlug: string;
}

export function RelatedProducts({ products, currentSlug }: RelatedProductsProps) {
  const addItem = useCartStore((s) => s.addItem);
  const filtered = products.filter((p) => p.slug !== currentSlug);

  if (filtered.length === 0) return null;

  return (
    <section aria-labelledby="related-title">
      <div className="mb-4 flex items-end justify-between">
        <h2
          id="related-title"
          className="font-display text-lg font-semibold text-maia-text"
        >
          Você também pode gostar
        </h2>
        <Link
          href={ROUTES.catalog}
          className="font-display text-xs font-medium text-maia-orange"
        >
          Ver tudo
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            cloudinaryPublicId={product.cloudinaryPublicId}
            categoryName={product.category?.name}
            onBuy={() => {
              addItem(product);
              toast.success("Adicionado ao carrinho");
            }}
          />
        ))}
      </div>
    </section>
  );
}
