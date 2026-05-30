"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import {
  Button,
  Card,
  ProductCard,
  Typography,
  toast,
  ScrollReveal,
} from "@/design-system";
import { fadeIn, slideUp, duration, easePremium } from "@/design-system/motion/config";
import { resolveFavoriteProducts } from "@/lib/favorites/helpers";
import { ROUTES } from "@/lib/constants/routes";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useCartStore } from "@/store/useCartStore";

export function FavoritesView() {
  const items = useFavoritesStore((s) =>
    s.items.filter((i) => !i.productId.startsWith("mock-"))
  );
  const products = resolveFavoriteProducts(items);
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <ScrollReveal variant="slideUp">
        <Card
          variant="default"
          padding="lg"
          className="flex flex-col items-center text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart
              className="h-12 w-12 text-maia-rose"
              strokeWidth={1.25}
            />
          </motion.div>
          <Typography variant="body-sm" className="mt-4 text-maia-muted">
            Você ainda não salvou nenhuma bolsa.
          </Typography>
          <Typography variant="caption" className="mt-1 text-maia-light">
            Toque no coração nos produtos para guardar aqui.
          </Typography>
          <Link href={ROUTES.catalog} className="mt-6">
            <Button variant="primary">Explorar catálogo</Button>
          </Link>
        </Card>
      </ScrollReveal>
    );
  }

  return (
    <div>
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: duration.base, ease: easePremium }}
        className="mb-5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-maia-nude/80 via-white to-maia-rose/40 px-4 py-3 ring-1 ring-maia-text/[0.04]"
      >
        <Sparkles className="h-4 w-4 shrink-0 text-maia-orange" />
        <Typography variant="body-sm" className="text-maia-muted">
          {items.length === 1
            ? "1 peça na sua seleção"
            : `${items.length} peças na sua seleção`}
        </Typography>
      </motion.div>

      <motion.ul
        layout
        className="product-grid"
        role="list"
        aria-label="Produtos favoritos"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.li
              key={product.id}
              layout
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{
                duration: duration.base,
                ease: easePremium,
                delay: Math.min(index * 0.04, 0.2),
              }}
              className="list-none"
            >
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
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
