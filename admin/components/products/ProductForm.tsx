"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import {
  adminApi,
  type AdminCategory,
  type AdminProduct,
  type ProductPayload,
} from "@/lib/api";

const PRODUCT_TYPES = [
  { value: "", label: "—" },
  { value: "clutch", label: "Clutch" },
  { value: "tote", label: "Tote" },
  { value: "bolsa", label: "Bolsa" },
  { value: "kit", label: "Kit" },
  { value: "mochila", label: "Mochila" },
  { value: "necessaire", label: "Nécessaire" },
  { value: "personalizada", label: "Personalizada" },
];

interface ProductFormProps {
  categories: AdminCategory[];
  initial?: AdminProduct;
  onSubmit: (data: ProductPayload) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({
  categories,
  initial,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [stock, setStock] = useState(String(initial?.stock ?? 0));
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [productType, setProductType] = useState(initial?.productType ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [isNew, setIsNew] = useState(initial?.isNew ?? false);
  const [active, setActive] = useState(initial?.active ?? true);
  const [images, setImages] = useState<string[]>(
    initial?.images?.length ? initial.images : initial?.imageUrl ? [initial.imageUrl] : []
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const res = await adminApi.uploadMultiple(Array.from(files));
      const urls = res.data.map((d) => d.secureUrl ?? d.url);
      setImages((prev) => [...prev, ...urls]);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Upload falhou. Verifique Cloudinary e API."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images.length) {
      setError("Adicione ao menos uma imagem.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        price: parseFloat(price) || 0,
        imageUrl: images[0],
        images,
        featured,
        isNew,
        productType: productType || null,
        active,
        stock: parseInt(stock, 10) || 0,
        categoryId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="admin-card space-y-4">
        <h2 className="font-display font-semibold">Imagens</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div
              key={url}
              className="relative h-24 w-24 overflow-hidden rounded-xl bg-maia-nude/30"
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-maia-orange px-1 text-[9px] font-bold text-white">
                  Capa
                </span>
              )}
              <button
                type="button"
                onClick={() => setImages((p) => p.filter((u) => u !== url))}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-maia-rose/80 text-maia-muted transition-colors hover:border-maia-orange hover:text-maia-orange">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="mt-1 text-[10px] font-medium">Upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>
        </div>
        <p className="text-xs text-maia-muted">
          Upload múltiplo via Cloudinary. A primeira imagem é a capa.
        </p>
      </div>

      <div className="admin-card grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="admin-label">Nome</label>
          <input
            className="admin-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="admin-label">Slug (opcional)</label>
          <input
            className="admin-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="gerado-automaticamente"
          />
        </div>
        <div>
          <label className="admin-label">Categoria</label>
          <select
            className="admin-input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Selecione</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="admin-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="admin-label">Estoque</label>
          <input
            type="number"
            min="0"
            className="admin-input"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="admin-label">Tipo</label>
          <select
            className="admin-input"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
          >
            {PRODUCT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="admin-label">Descrição</label>
          <textarea
            className="admin-input min-h-[120px] resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Destaque
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
          />
          Lançamento
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Ativo no catálogo
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Salvando..." : initial ? "Salvar alterações" : "Criar produto"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
}
