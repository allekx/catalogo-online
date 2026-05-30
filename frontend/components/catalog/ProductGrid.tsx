"use client";

import { ProductCard, toast } from "@/design-system";
import { StaggerReveal, StaggerItem } from "@/design-system/motion";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/lib/products/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <StaggerReveal stagger={0.04} className="product-grid">
      {products.map((product, i) => (
        <StaggerItem key={product.id}>
          <ProductCard
            id={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            cloudinaryPublicId={product.cloudinaryPublicId}
            categoryName={product.category?.name}
            priority={i < 2}
            onBuy={() => {
              addItem(product);
              toast.success("Adicionado ao carrinho");
            }}
          />
        </StaggerItem>
      ))}
    </StaggerReveal>
  );
}
