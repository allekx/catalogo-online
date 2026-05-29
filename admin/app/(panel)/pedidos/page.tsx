"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, type AdminOrder, ORDER_STATUS_LABELS } from "@/lib/api";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "WHATSAPP_SENT", label: "WhatsApp" },
  { value: "CONFIRMED", label: "Confirmados" },
  { value: "IN_PRODUCTION", label: "Produção" },
  { value: "SHIPPED", label: "Enviados" },
  { value: "DELIVERED", label: "Entregues" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminApi.orders
      .list(status || undefined)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold">Pedidos</h1>
        <p className="text-sm text-maia-muted">Histórico e status dos pedidos</p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatus(f.value)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              status === f.value
                ? "bg-maia-orange text-white"
                : "bg-white text-maia-muted ring-1 ring-black/[0.08]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-card text-sm text-maia-muted">Carregando...</div>
      ) : orders.length === 0 ? (
        <div className="admin-card text-sm text-maia-muted">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/pedidos/${o.id}`}
              className="admin-card flex flex-wrap items-center justify-between gap-4 transition-shadow hover:shadow-md"
            >
              <div>
                <p className="font-display font-semibold">{o.orderNumber}</p>
                <p className="text-sm text-maia-muted">
                  {o.customer.name} · {formatDate(o.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-maia-orange">
                  {formatCurrency(o.total)}
                </p>
                <p className="text-xs text-maia-muted">
                  {ORDER_STATUS_LABELS[o.status]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
