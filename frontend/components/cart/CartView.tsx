"use client";

import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useAppStore } from "@/store/useAppStore";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { CartEmpty } from "./CartEmpty";
import { toast } from "@/design-system";
import { ROUTES } from "@/lib/constants/routes";

interface CartViewProps {
  variant?: "page" | "sheet";
}

export function CartView({ variant = "page" }: CartViewProps) {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const closeCart = useAppStore((s) => s.closeCart);
  const compact = variant === "sheet";

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className={compact ? "space-y-4" : "space-y-5 pb-4"}>
      <ul className="space-y-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} compact={compact} />
          ))}
        </AnimatePresence>
      </ul>

      <CartSummary
        items={items}
        showFullCartLink={compact}
        onAfterWhatsApp={() => closeCart()}
      />

      {!compact && (
        <div className="flex items-center justify-between pt-1">
          <Link
            href={ROUTES.catalog}
            className="font-display text-sm font-medium text-maia-orange"
          >
            Continuar comprando
          </Link>
          <button
            type="button"
            onClick={() => {
              clearCart();
              toast.info("Carrinho esvaziado");
            }}
            className="font-display text-xs text-maia-light underline"
          >
            Limpar carrinho
          </button>
        </div>
      )}
    </div>
  );
}
