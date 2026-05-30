"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/cart/format";
import { buildOrderMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { ROUTES } from "@/lib/constants/routes";
import type { CartItem } from "@/lib/products/types";

interface CartSummaryProps {
  items: CartItem[];
  showFullCartLink?: boolean;
  onAfterWhatsApp?: () => void;
}

export function CartSummary({
  items,
  showFullCartLink,
  onAfterWhatsApp,
}: CartSummaryProps) {
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const orderMessage = buildOrderMessage(items);

  if (items.length === 0) return null;

  return (
    <motion.div
      layout
      className="space-y-3 rounded-3xl border border-maia-rose/30 bg-white p-4 shadow-card"
    >
      <div className="space-y-2 font-body text-sm">
        <div className="flex justify-between text-maia-muted">
          <span>Quantidade total</span>
          <span className="font-display font-semibold text-maia-text">
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </span>
        </div>
        <div className="flex justify-between border-t border-maia-text/5 pt-2">
          <span className="font-display font-semibold text-maia-text">
            Total do pedido
          </span>
          <span className="font-display text-lg font-bold text-maia-orange">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <WhatsAppButton
        message={orderMessage}
        label="Finalizar pedido no WhatsApp"
        onAfterClick={onAfterWhatsApp}
      />

      <p className="text-center font-body text-[10px] leading-relaxed text-maia-light">
        Mensagem montada automaticamente com seus itens. Personalização feita
        manualmente pelo responsável.
      </p>

      {showFullCartLink && (
        <Link
          href={ROUTES.cart}
          className="flex items-center justify-center gap-1.5 font-display text-xs font-medium text-maia-orange"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Ver carrinho completo
        </Link>
      )}
    </motion.div>
  );
}
