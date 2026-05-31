"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductGridSkeleton, ProductCard, toast, ScrollReveal } from "@/design-system";
import { StaggerReveal, StaggerItem } from "@/design-system/motion";
import { fetchProducts } from "@/lib/products/fetch";
import { ROUTES } from "@/lib/constants/routes";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/lib/products/types";

interface HomeProductsSectionProps {
  /** Produtos pré-carregados no servidor (SSR) */
  initialProducts?: Product[];
}

export function HomeProductsSection({
  initialProducts = [],
}: HomeProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let cancelled = false;
    const silentRefresh = initialProducts.length > 0;
    if (!silentRefresh) setLoading(true);

    fetchProducts()
      .then((data) => {
        if (cancelled) return;
        const featured = data.filter((p) => p.featured);
        setProducts(
          (featured.length > 0 ? featured : data).slice(0, 6)
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialProducts.length]);

  return (
    <section className="mt-8 pb-2" aria-labelledby="home-products-title">
      <ScrollReveal variant="slideUpSubtle" className="mb-4 flex items-end justify-between px-0.5">
        <div>
          <h2
            id="home-products-title"
            className="font-display text-lg font-semibold text-maia-text"
          >
            Destaques
          </h2>
          <p className="mt-0.5 font-body text-xs text-maia-muted">
            Peças selecionadas para você
          </p>
        </div>
        <Link
          href={ROUTES.catalog}
          className="font-display text-xs font-medium text-maia-orange active:opacity-70"
        >
          Ver tudo
        </Link>
      </ScrollReveal>

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : products.length === 0 ? (
        <p className="rounded-2xl bg-maia-nude/40 px-4 py-8 text-center font-body text-sm text-maia-muted">
          Nenhum produto cadastrado ainda. Em breve novidades por aqui.
        </p>
      ) : (
        <StaggerReveal stagger={0.05} className="product-grid">
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
      )}
    </section>
  );
}
