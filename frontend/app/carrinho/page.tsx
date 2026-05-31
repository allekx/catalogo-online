"use client";

import { Typography } from "@/design-system";
import { CartView } from "@/components/cart/CartView";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const itemCount = useCartStore((s) => s.itemCount);

  return (
    <div>
      <Typography variant="display-sm" className="mb-1">
        Carrinho
      </Typography>
      <Typography variant="body-sm" className="mb-6 text-maia-muted">
        {itemCount > 0
          ? `${itemCount} ${itemCount === 1 ? "item no pedido" : "itens no pedido"}`
          : "Seus itens ficam salvos neste dispositivo"}
      </Typography>
      <CartView variant="page" />
    </div>
  );
}
