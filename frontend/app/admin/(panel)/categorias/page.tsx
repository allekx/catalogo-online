"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { adminApi, ApiError, type AdminCategory } from "@/lib/admin/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    adminApi.categories
      .list()
      .then(setCategories)
      .catch((err) => {
        setError(
          err instanceof ApiError ? err.message : "Erro ao carregar categorias"
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    try {
      await adminApi.categories.create({ name: name.trim() });
      setName("");
      load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Erro ao criar categoria"
      );
    }
  };

  const handleDelete = async (id: string, catName: string, count: number) => {
    if (count > 0) {
      alert("Remova os produtos desta categoria antes de excluir.");
      return;
    }
    if (!confirm(`Excluir categoria "${catName}"?`)) return;
    setError("");
    try {
      await adminApi.categories.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        return;
      }
      setError(
        err instanceof ApiError ? err.message : "Erro ao excluir categoria"
      );
      load();
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold">Categorias</h1>
        <p className="text-sm text-maia-muted">Organize o catálogo por coleções</p>
      </header>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

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
