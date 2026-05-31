"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import {
  Check,
  GripVertical,
  ImagePlus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { adminApi, ApiError, type AdminCategory } from "@/lib/admin/api";
import { cn } from "@/lib/utils/cn";

function reorderList<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

type AdminCategoryListProps = {
  categories: AdminCategory[];
  onCategoriesChange: (next: AdminCategory[]) => void;
  onError: (message: string) => void;
  onReload: () => void;
  uploadingId: string | null;
  onUploadImage: (id: string, files: FileList | null) => void;
  onDelete: (id: string, name: string) => void;
};

export function AdminCategoryList({
  categories,
  onCategoriesChange,
  onError,
  onReload,
  uploadingId,
  onUploadImage,
  onDelete,
}: AdminCategoryListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [savingNameId, setSavingNameId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragFromIndex = useRef<number | null>(null);

  const persistOrder = useCallback(
    async (next: AdminCategory[]) => {
      setReordering(true);
      onError("");
      try {
        await adminApi.categories.reorder(
          next.map((c, index) => ({ id: c.id, sortOrder: index }))
        );
        onCategoriesChange(
          next.map((c, index) => ({ ...c, sortOrder: index }))
        );
      } catch (err) {
        onError(
          err instanceof ApiError ? err.message : "Erro ao reordenar categorias"
        );
        onReload();
      } finally {
        setReordering(false);
      }
    },
    [onCategoriesChange, onError, onReload]
  );

  const resolveDropIndex = (clientY: number) => {
    const list = listRef.current;
    if (!list) return null;
    const rows = list.querySelectorAll<HTMLElement>("[data-category-row]");
    for (let i = 0; i < rows.length; i++) {
      const rect = rows[i].getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (clientY < mid) return i;
    }
    return rows.length - 1;
  };

  const startEdit = (cat: AdminCategory) => {
    setEditingId(cat.id);
    setDraftName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName("");
  };

  const saveName = async (id: string) => {
    const trimmed = draftName.trim();
    const current = categories.find((c) => c.id === id);
    if (!trimmed || !current || trimmed === current.name) {
      cancelEdit();
      return;
    }
    setSavingNameId(id);
    onError("");
    try {
      const updated = await adminApi.categories.update(id, { name: trimmed });
      onCategoriesChange(
        categories.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );
      cancelEdit();
    } catch (err) {
      onError(
        err instanceof ApiError ? err.message : "Erro ao salvar nome da categoria"
      );
    } finally {
      setSavingNameId(null);
    }
  };

  const handleDragStart = (index: number, id: string) => {
    dragFromIndex.current = index;
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDropIndex(index);
  };

  const handleDrop = async (toIndex: number) => {
    const from = dragFromIndex.current;
    setDraggingId(null);
    setDropIndex(null);
    dragFromIndex.current = null;
    if (from == null || from === toIndex) return;
    const next = reorderList(categories, from, toIndex);
    onCategoriesChange(next);
    await persistOrder(next);
  };

  const handleGripPointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    index: number,
    id: string
  ) => {
    if (reordering || editingId) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragFromIndex.current = index;
    setDraggingId(id);
    setDropIndex(index);
  };

  const handleGripPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragFromIndex.current == null) return;
    const next = resolveDropIndex(e.clientY);
    if (next != null) setDropIndex(next);
  };

  const handleGripPointerUp = async (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (dragFromIndex.current == null) return;
    const from = dragFromIndex.current;
    const to = dropIndex ?? from;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDraggingId(null);
    setDropIndex(null);
    dragFromIndex.current = null;
    if (from === to) return;
    const next = reorderList(categories, from, to);
    onCategoriesChange(next);
    await persistOrder(next);
  };

  return (
    <div ref={listRef} className="space-y-3">
      {reordering && (
        <p className="text-center text-xs text-maia-muted">Salvando ordem…</p>
      )}
      {categories.map((c, index) => {
        const isDragging = draggingId === c.id;
        const isDropTarget = dropIndex === index && draggingId && draggingId !== c.id;
        const isEditing = editingId === c.id;

        return (
          <div
            key={c.id}
            data-category-row
            draggable={!reordering && !isEditing}
            onDragStart={() => handleDragStart(index, c.id)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={() => {
              setDraggingId(null);
              setDropIndex(null);
              dragFromIndex.current = null;
            }}
            className={cn(
              "admin-card flex items-center gap-2 transition-shadow sm:gap-3",
              isDragging && "opacity-60 ring-2 ring-maia-orange/30",
              isDropTarget && "ring-2 ring-maia-orange/50"
            )}
          >
            <button
              type="button"
              className="flex h-10 w-8 shrink-0 touch-none cursor-grab items-center justify-center rounded-lg text-maia-muted active:cursor-grabbing hover:bg-maia-nude/50 hover:text-maia-text"
              aria-label={`Reordenar ${c.name}`}
              disabled={reordering || Boolean(editingId)}
              onPointerDown={(e) => handleGripPointerDown(e, index, c.id)}
              onPointerMove={handleGripPointerMove}
              onPointerUp={handleGripPointerUp}
              onPointerCancel={handleGripPointerUp}
            >
              <GripVertical className="h-5 w-5" />
            </button>

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
                disabled={uploadingId === c.id || reordering}
                onChange={(e) => {
                  onUploadImage(c.id, e.target.files);
                  e.target.value = "";
                }}
              />
            </label>

            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    className="admin-input min-w-0 flex-1 py-1.5 text-sm"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void saveName(c.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                    disabled={savingNameId === c.id}
                  />
                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-maia-orange text-white"
                    onClick={() => void saveName(c.id)}
                    disabled={savingNameId === c.id}
                    aria-label="Salvar nome"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-maia-nude/60 text-maia-muted"
                    onClick={cancelEdit}
                    disabled={savingNameId === c.id}
                    aria-label="Cancelar edição"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="text-xs text-maia-muted">
                      /{c.slug} · {c._count?.products ?? 0} produto(s)
                      {uploadingId === c.id ? " · enviando foto…" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-maia-muted hover:bg-maia-nude/50 hover:text-maia-orange"
                    onClick={() => startEdit(c)}
                    disabled={reordering}
                    aria-label={`Editar nome de ${c.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDelete(c.id, c.name)}
              className="btn-danger shrink-0 !px-2.5 !py-2"
              disabled={reordering || isEditing}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
