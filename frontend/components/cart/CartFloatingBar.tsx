"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/cart/format";
import { ROUTES } from "@/lib/constants/routes";
import { useCartStore } from "@/store/useCartStore";
import { useAppStore } from "@/store/useAppStore";

export function CartFloatingBar() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount);
  const total = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
  const openCart = useAppStore((s) => s.openCart);

  const hidden =
    pathname === ROUTES.cart || itemCount === 0;

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="cart-bar-bottom fixed left-0 right-0 z-40 px-4 lg:hidden"
        >
          <div className="app-container">
            <button
              type="button"
              onClick={openCart}
              className="mx-auto flex min-h-[48px] w-full max-w-app-wide touch-manipulation items-center justify-between gap-3 rounded-2xl bg-maia-text px-4 py-3.5 shadow-float active:scale-[0.99] lg:max-w-app"
            >
              <span className="flex items-center gap-2 text-white">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
                <span className="font-display text-sm font-semibold">
                  Carrinho ({itemCount})
                </span>
              </span>
              <span className="font-display text-sm font-bold text-maia-orange">
                {formatPrice(total)}
              </span>
            </button>
            <Link
              href={ROUTES.cart}
              className="sr-only"
              aria-hidden
            >
              Carrinho completo
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
