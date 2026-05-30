"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getOptimizedThumbUrl } from "@/lib/products/images";
import { ROUTES } from "@/lib/constants/routes";
import { formatPrice, getItemSubtotal } from "@/lib/cart/format";
import { useCartStore } from "@/store/useCartStore";
import type { CartItem } from "@/lib/products/types";
import { cn } from "@/lib/utils/cn";

interface CartItemRowProps {
  item: CartItem;
  compact?: boolean;
}

export function CartItemRow({ item, compact }: CartItemRowProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateObservations = useCartStore((s) => s.updateObservations);
  const subtotal = getItemSubtotal(item.price, item.quantity);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="rounded-3xl bg-white p-3 shadow-card"
    >
      <div className="flex gap-3">
        <Link
          href={ROUTES.product(item.slug)}
          className={cn(
            "relative shrink-0 overflow-hidden rounded-2xl bg-maia-nude/40",
            compact ? "h-16 w-16" : "h-[4.5rem] w-[4.5rem]"
          )}
        >
          <Image
            src={getOptimizedThumbUrl(item.imageUrl, item.cloudinaryPublicId)}
            alt={item.name}
            fill
            loading="lazy"
            decoding="async"
            className="object-cover"
            sizes="72px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <p className="font-display text-[10px] font-medium uppercase tracking-wide text-maia-light">
            {item.categoryName}
          </p>
          <Link href={ROUTES.product(item.slug)}>
            <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-maia-text">
              {item.name}
            </h3>
          </Link>
          <p className="mt-0.5 font-body text-xs text-maia-muted">
            {formatPrice(item.price)} / un.
          </p>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center rounded-xl border border-maia-rose/40 bg-maia-nude/30">
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center text-maia-text active:bg-maia-nude"
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
              <span className="min-w-[1.75rem] text-center font-display text-sm font-semibold text-maia-text">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center text-maia-text active:bg-maia-nude"
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>

            <p className="font-display text-sm font-bold text-maia-orange">
              {formatPrice(subtotal)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => removeItem(item.productId)}
          className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-xl text-maia-light active:bg-red-50 active:text-semantic-error"
          aria-label="Remover do carrinho"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      {!compact && (
        <label className="mt-3 block">
          <span className="mb-1 block font-display text-[10px] font-medium uppercase tracking-wide text-maia-light">
            Observações
          </span>
          <textarea
            value={item.observations ?? ""}
            onChange={(e) =>
              updateObservations(item.productId, e.target.value)
            }
            placeholder="Ex: cor da alça, presente, prazo..."
            rows={2}
            className="w-full resize-none rounded-xl border border-maia-rose/40 bg-white px-3 py-2 font-body text-xs text-maia-text placeholder:text-maia-light focus:border-maia-orange focus:outline-none focus:ring-2 focus:ring-maia-orange/20"
          />
        </label>
      )}
    </motion.li>
  );
}
