"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminCustomer } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.customers
      .list()
      .then(setCustomers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold">Clientes</h1>
        <p className="text-sm text-maia-muted">
          {customers.length} cliente(s) cadastrado(s)
        </p>
      </header>

      {loading ? (
        <div className="admin-card text-sm text-maia-muted">Carregando...</div>
      ) : customers.length === 0 ? (
        <div className="admin-card text-sm text-maia-muted">
          Nenhum cliente ainda. Pedidos via WhatsApp criam registros aqui.
        </div>
      ) : (
        <div className="admin-card overflow-x-auto p-0">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] text-xs uppercase tracking-wide text-maia-muted">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Contato</th>
                <th className="px-4 py-3 font-medium">Pedidos</th>
                <th className="px-4 py-3 font-medium">Último pedido</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-black/[0.04] last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-maia-muted">
                    {c.phone ?? c.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">{c.ordersCount}</td>
                  <td className="px-4 py-3">
                    {c.lastOrderAt ? (
                      <span>
                        {formatDate(c.lastOrderAt)}
                        {c.lastOrderTotal != null && (
                          <span className="ml-1 text-maia-orange">
                            · {formatCurrency(c.lastOrderTotal)}
                          </span>
                        )}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
