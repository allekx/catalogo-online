"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  adminApi,
  type AdminOrder,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/lib/admin/api";
import { formatCurrency, formatDate } from "@/lib/admin/utils";

const ALL_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.orders.get(id).then(setOrder);
  }, [id]);

  const updateStatus = async (status: OrderStatus) => {
    setSaving(true);
    try {
      const updated = await adminApi.orders.updateStatus(id, status);
      setOrder(updated);
    } finally {
      setSaving(false);
    }
  };

  if (!order) {
    return <div className="admin-card text-sm text-maia-muted">Carregando...</div>;
  }

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-maia-muted hover:text-maia-orange"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos pedidos
      </Link>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-maia-muted">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <p className="font-display text-2xl font-bold text-maia-orange">
          {formatCurrency(order.total)}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="admin-card">
          <h2 className="mb-3 font-display font-semibold">Cliente</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-maia-muted">Nome</dt>
              <dd className="font-medium">{order.customer.name}</dd>
            </div>
            {order.customer.phone && (
              <div>
                <dt className="text-maia-muted">Telefone</dt>
                <dd>{order.customer.phone}</dd>
              </div>
            )}
            {order.customer.email && (
              <div>
                <dt className="text-maia-muted">E-mail</dt>
                <dd>{order.customer.email}</dd>
              </div>
            )}
            {order.customer.city && (
              <div>
                <dt className="text-maia-muted">Cidade</dt>
                <dd>{order.customer.city}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="admin-card">
          <h2 className="mb-3 font-display font-semibold">Status</h2>
          <select
            className="admin-input"
            value={order.status}
            disabled={saving}
            onChange={(e) => updateStatus(e.target.value as OrderStatus)}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          {order.notes && (
            <p className="mt-3 text-sm text-maia-muted">
              <span className="font-medium text-maia-text">Obs:</span>{" "}
              {order.notes}
            </p>
          )}
        </section>
      </div>

      <section className="admin-card mt-6">
        <h2 className="mb-3 font-display font-semibold">Itens</h2>
        <ul className="divide-y divide-black/[0.06]">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-maia-muted">Qtd: {item.quantity}</p>
                {item.observations && (
                  <p className="text-xs text-maia-muted">{item.observations}</p>
                )}
              </div>
              <p className="font-semibold">{formatCurrency(item.lineTotal)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
