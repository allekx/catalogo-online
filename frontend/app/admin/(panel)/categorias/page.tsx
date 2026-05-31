"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { adminApi, ApiError, type AdminCategory } from "@/lib/admin/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [name, setName] = useState("");
  const [createImageUrl, setCreateImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const createFileRef = useRef<HTMLInputElement>(null);

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

  const uploadImage = async (file: File): Promise<string> => {
    const res = await adminApi.uploadMultiple([file]);
    const url = res.data[0]?.secureUrl ?? res.data[0]?.url;
    if (!url) throw new Error("Upload sem URL de retorno");
    return url;
  };

  const handleCreateFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      setCreateImageUrl(await uploadImage(file));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Falha no upload. Verifique Cloudinary e API."
      );
    } finally {
      setUploading(false);
      if (createFileRef.current) createFileRef.current.value = "";
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await adminApi.categories.create({
        name: name.trim(),
        ...(createImageUrl ? { imageUrl: createImageUrl } : {}),
      });
      setName("");
      setCreateImageUrl(null);
      load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Erro ao criar categoria"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateImage = async (id: string, files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUpdatingId(id);
    setError("");
    try {
      const imageUrl = await uploadImage(file);
      const updated = await adminApi.categories.update(id, { imageUrl });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Erro ao atualizar foto"
      );
    } finally {
      setUpdatingId(null);
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

      <form onSubmit={handleCreate} className="admin-card mb-6 space-y-4">
        <div className="flex flex-wrap items-start gap-4">
          <button
            type="button"
            onClick={() => createFileRef.current?.click()}
            disabled={uploading}
            className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-maia-nude bg-maia-nude/30 text-maia-muted transition hover:border-maia-orange/50 hover:text-maia-orange disabled:opacity-50"
            aria-label="Escolher foto da categoria"
          >
            {createImageUrl ? (
              <Image
                src={createImageUrl}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <ImagePlus className="h-7 w-7" />
            )}
          </button>
          <input
            ref={createFileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleCreateFile(e.target.files)}
          />
          <div className="min-w-0 flex-1 space-y-2">
            <input
              className="admin-input w-full"
              placeholder="Nome da categoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-maia-muted">
              Toque no quadrado para enviar a foto (opcional). Aparece na home e em
              Categorias.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {createImageUrl && (
            <button
              type="button"
              className="text-sm text-maia-muted underline"
              onClick={() => setCreateImageUrl(null)}
            >
              Remover foto
            </button>
          )}
          <button
            type="submit"
            className="btn-primary ml-auto shrink-0"
            disabled={saving || uploading}
          >
            <Plus className="h-4 w-4" />
            {saving ? "Salvando…" : "Adicionar"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="admin-card text-sm text-maia-muted">Carregando...</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="admin-card flex items-center gap-3">
              <label
                className="relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-maia-nude/40 text-maia-muted ring-1 ring-maia-text/5 hover:ring-maia-orange/40"
                title="Alterar foto"
              >
                {c.imageUrl ? (
                  <Image
                    src={c.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <ImagePlus className="h-5 w-5" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={updatingId === c.id}
                  onChange={(e) => {
                    handleUpdateImage(c.id, e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{c.name}</p>
                <p className="text-xs text-maia-muted">
                  /{c.slug} · {c._count?.products ?? 0} produto(s)
                  {updatingId === c.id ? " · enviando foto…" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleDelete(c.id, c.name, c._count?.products ?? 0)
                }
                className="btn-danger shrink-0 !px-2.5 !py-2"
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
