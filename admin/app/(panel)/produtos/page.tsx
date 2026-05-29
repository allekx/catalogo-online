"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminApi, type AdminProduct } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.products
      .list()
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir "${name}"?`)) return;
    await adminApi.products.delete(id);
    load();
  };

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Produtos</h1>
          <p className="text-sm text-maia-muted">
            {products.length} produto(s) cadastrado(s)
          </p>
        </div>
        <Link href="/produtos/novo" className="btn-primary">
          <Plus className="h-4 w-4" />
          Novo produto
        </Link>
      </header>

      {loading ? (
        <div className="admin-card text-sm text-maia-muted">Carregando...</div>
      ) : (
        <div className="admin-card overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] text-xs uppercase tracking-wide text-maia-muted">
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Estoque</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-black/[0.04] last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-maia-nude/40">
                        <Image
                          src={p.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="text-xs text-maia-muted">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-maia-muted">
                    {p.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.featured && (
                        <span className="rounded-full bg-maia-orange/10 px-2 py-0.5 text-[10px] font-semibold text-maia-orange">
                          Destaque
                        </span>
                      )}
                      {p.isNew && (
                        <span className="rounded-full bg-maia-rose/60 px-2 py-0.5 text-[10px] font-semibold">
                          Novo
                        </span>
                      )}
                      {!p.active && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                          Inativo
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/produtos/${p.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-maia-nude/60"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
