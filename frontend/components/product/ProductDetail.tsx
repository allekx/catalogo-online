"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ShoppingBag, Sparkles } from "lucide-react";
import { CatalogBackLink } from "./CatalogBackLink";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import {
  Button,
  Typography,
  Input,
  toast,
  ScrollReveal,
} from "@/design-system";
import { ProductGallery } from "./ProductGallery";
import { ProductShare } from "./ProductShare";
import { RelatedProducts } from "./RelatedProducts";
import { useAppStore } from "@/store/useAppStore";
import { useCartStore } from "@/store/useCartStore";
import {
  buildPersonalizationMessage,
  openWhatsApp,
} from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format/currency";
import { ROUTES } from "@/lib/constants/routes";
import type { Product } from "@/lib/products/types";

interface ProductDetailProps {
  product: Product;
  related: Product[];
}

export function ProductDetail({ product, related }: ProductDetailProps) {
  const [observations, setObservations] = useState("");
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useAppStore((s) => s.openCart);

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.warning("Produto indisponível no momento");
      return;
    }
    addItem(product, { observations: observations || undefined });
    toast.success("Adicionado ao carrinho");
    openCart();
  };

  const handlePersonalizationWhatsApp = () => {
    openWhatsApp(buildPersonalizationMessage(product, observations));
  };

  return (
    <article>
      <CatalogBackLink />

      <div className="lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,26rem)_1fr]">
        <ProductGallery product={product} productName={product.name} />

        <ScrollReveal variant="slideUp" className="mt-5 space-y-5 px-0.5 lg:mt-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {product.category && (
              <Link
                href={`${ROUTES.catalog}?categoria=${product.category.slug}`}
                className="font-display text-[10px] font-semibold uppercase tracking-widest text-maia-orange"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-maia-text">
              {product.name}
            </h1>
            <p className="mt-2 font-display text-2xl font-bold text-maia-orange">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <FavoriteButton
              product={product}
              size="md"
              variant="inline"
              className="rounded-2xl"
            />
            <ProductShare product={product} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-maia-orange/10 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-wide text-maia-orange">
              <Sparkles className="h-3 w-3" />
              Destaque
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-wide ${
              product.inStock
                ? "bg-semantic-success/10 text-semantic-success"
                : "bg-maia-nude text-maia-muted"
            }`}
          >
            {product.inStock
              ? `${product.stock} em estoque`
              : "Indisponível"}
          </span>
        </div>

        <Typography variant="body-sm" className="leading-relaxed text-maia-muted">
          {product.description}
        </Typography>

        {/* Observações */}
        <div className="rounded-3xl bg-maia-nude/30 p-4">
          <Input
            label="Observações do pedido"
            placeholder="Ex: cor da alça, presente, prazo desejado..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            hint="Opcional — também enviadas no WhatsApp ao personalizar"
          />
        </div>

        {/* Ações */}
        <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 -mx-0.5 space-y-3 rounded-3xl border border-maia-rose/30 bg-white/95 p-4 shadow-nav backdrop-blur-xl">
          <Button
            variant="secondary"
            fullWidth
            leftIcon={<MessageCircle className="h-5 w-5 text-[#25D366]" />}
            className="border-[#25D366]/30 bg-[#25D366]/5"
            onClick={handlePersonalizationWhatsApp}
          >
            Solicitar Personalização no WhatsApp
          </Button>

          <p className="text-center font-body text-[11px] leading-relaxed text-maia-light">
            A personalização é feita diretamente com nossa equipe via WhatsApp —
            monograma, cores e detalhes sob medida.
          </p>

          <Button
            variant="primary"
            fullWidth
            disabled={!product.inStock}
            leftIcon={<ShoppingBag className="h-5 w-5" />}
            onClick={handleAddToCart}
          >
            {product.inStock ? "Adicionar ao carrinho" : "Indisponível"}
          </Button>
        </div>
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-10">
        <RelatedProducts products={related} currentSlug={product.slug} />
      </ScrollReveal>
    </article>
  );
}
