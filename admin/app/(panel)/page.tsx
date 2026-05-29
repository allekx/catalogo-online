"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ClipboardList,
  Eye,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { adminApi, type DashboardStats, ORDER_STATUS_LABELS } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .dashboard()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Erro"));
  }, []);

  const cards = stats
    ? [
        {
          label: "Produtos cadastrados",
          value: stats.productsCount,
          icon: Package,
          color: "bg-maia-orange/10 text-maia-orange",
        },
        {
          label: "Pedidos enviados",
          value: stats.ordersCount,
          icon: ClipboardList,
          color: "bg-maia-rose/50 text-maia-text",
        },
        {
          label: "Cliques WhatsApp",
          value: stats.whatsappClicksTotal,
          icon: MessageCircle,
          color: "bg-emerald-50 text-emerald-600",
        },
      ]
    : [];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-maia-muted">
          Visão geral do catálogo Le Maia
        </p>
      </header>

      {error && (
        <div className="admin-card mb-6 text-sm text-red-600">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="admin-card flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-maia-muted">
                {label}
              </p>
              <p className="mt-1 font-display text-3xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="admin-card">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4 text-maia-orange" />
            <h2 className="font-display font-semibold">Mais acessados</h2>
          </div>
          {!stats?.topViewed.length ? (
            <p className="text-sm text-maia-muted">Sem dados ainda.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topViewed.map((p, i) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maia-nude text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="truncate font-medium">{p.name}</span>
                  </span>
                  <span className="shrink-0 text-maia-muted">
                    {p.viewCount} views
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-maia-orange" />
              <h2 className="font-display font-semibold">Pedidos recentes</h2>
            </div>
            <Link
              href="/pedidos"
              className="text-xs font-medium text-maia-orange"
            >
              Ver todos
            </Link>
          </div>
          {!stats?.recentOrders.length ? (
            <p className="text-sm text-maia-muted">Nenhum pedido ainda.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentOrders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/pedidos/${o.id}`}
                    className="flex items-center justify-between gap-2 rounded-xl p-2 text-sm transition-colors hover:bg-maia-nude/40"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{o.orderNumber}</p>
                      <p className="truncate text-xs text-maia-muted">
                        {o.customerName} · {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold text-maia-orange">
                        {formatCurrency(o.total)}
                      </p>
                      <p className="text-[10px] text-maia-muted">
                        {ORDER_STATUS_LABELS[o.status]}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
