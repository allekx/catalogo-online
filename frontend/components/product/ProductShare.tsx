"use client";

import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/design-system";
import { clientEnv } from "@/lib/env";
import { ROUTES } from "@/lib/constants/routes";
import type { Product } from "@/lib/products/types";

interface ProductShareProps {
  product: Product;
}

export function ProductShare({ product }: ProductShareProps) {
  const [copied, setCopied] = useState(false);
  const url = `${clientEnv.siteUrl}${ROUTES.product(product.slug)}`;

  const share = async () => {
    const payload = {
      title: `${product.name} | Le Maia`,
      text: product.description.slice(0, 120),
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        /* fallback copy */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível compartilhar");
    }
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={share}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-maia-rose/50 bg-white text-maia-muted transition-colors hover:border-maia-orange/40 hover:text-maia-orange"
      aria-label="Compartilhar produto"
    >
      {copied ? (
        <Check className="h-5 w-5 text-semantic-success" />
      ) : (
        <Share2 className="h-5 w-5" strokeWidth={1.75} />
      )}
    </motion.button>
  );
}

export function ProductShareInline({ product }: ProductShareProps) {
  return (
    <button
      type="button"
      onClick={async () => {
        const url = `${clientEnv.siteUrl}${ROUTES.product(product.slug)}`;
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado!");
      }}
      className="inline-flex items-center gap-1.5 font-display text-xs font-medium text-maia-orange"
    >
      <Link2 className="h-3.5 w-3.5" />
      Copiar link
    </button>
  );
}
