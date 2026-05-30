"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useAppStore } from "@/store/useAppStore";
import { useCartStore } from "@/store/useCartStore";
import { CartView } from "./CartView";
import { easings } from "@/design-system/tokens/animations";
import { cn } from "@/lib/utils/cn";

export function CartBottomSheet() {
  const { isCartOpen, closeCart } = useAppStore();
  const itemCount = useCartStore((s) => s.itemCount);
  const dragControls = useDragControls();
  useBodyScrollLock(isCartOpen);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCartOpen, closeCart]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 80 || info.velocity.y > 400) closeCart();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center md:hidden"
          role="presentation"
        >
          <motion.button
            type="button"
            aria-label="Fechar carrinho"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-maia-text/50 backdrop-blur-md"
            onClick={closeCart}
          />

          <motion.div
            role="dialog"
            aria-modal
            aria-label="Carrinho de compras"
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={easings.softSpring}
            className={cn(
              "relative z-10 flex max-h-[88vh] w-full max-w-app flex-col",
              "rounded-t-3xl bg-[#FAFAFA] shadow-nav safe-bottom"
            )}
          >
            <div
              className="flex cursor-grab justify-center py-3 active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <span className="h-1 w-10 rounded-full bg-maia-rose" />
            </div>

            <div className="flex items-center justify-between border-b border-maia-text/5 px-5 pb-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-maia-text">
                  Carrinho
                </h2>
                {itemCount > 0 && (
                  <p className="font-body text-xs text-maia-muted">
                    {itemCount} {itemCount === 1 ? "item" : "itens"}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">
              <CartView variant="sheet" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
