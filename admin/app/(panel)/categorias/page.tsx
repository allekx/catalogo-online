"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { adminApi, type AdminCategory } from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminApi.categories.list().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await adminApi.categories.create({ name: name.trim() });
    setName("");
    load();
  };

  const handleDelete = async (id: string, catName: string, count: number) => {
    if (count > 0) {
      alert("Remova os produtos desta categoria antes de excluir.");
      return;
    }
    if (!confirm(`Excluir categoria "${catName}"?`)) return;
    await adminApi.categories.delete(id);
    load();
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold">Categorias</h1>
        <p className="text-sm text-maia-muted">Organize o catálogo por coleções</p>
      </header>

      <form onSubmit={handleCreate} className="admin-card mb-6 flex flex-wrap gap-3">
        <input
          className="admin-input min-w-[200px] flex-1"
          placeholder="Nome da categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </form>

      {loading ? (
        <div className="admin-card text-sm text-maia-muted">Carregando...</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="admin-card flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-maia-muted">
                  /{c.slug} · {c._count?.products ?? 0} produto(s)
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleDelete(c.id, c.name, c._count?.products ?? 0)
                }
                className="btn-danger !px-2.5 !py-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
