"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { SORT_OPTIONS, countActiveFilters } from "@/lib/catalog";
import type { CatalogFilters, CatalogSort } from "@/lib/catalog/types";
import type { CatalogCategoryOption } from "@/hooks/useCatalogCategories";
import { cn } from "@/lib/utils/cn";

interface CatalogToolbarProps {
  filters: CatalogFilters;
  categories: CatalogCategoryOption[];
  onOpenFilters: () => void;
  onSortChange: (sort: CatalogSort) => void;
  onClearFilter: (key: "category" | "price" | "featured" | "new") => void;
}

export function CatalogToolbar({
  filters,
  categories,
  onOpenFilters,
  onSortChange,
  onClearFilter,
}: CatalogToolbarProps) {
  const activeCount = countActiveFilters(filters);
  const hasPrice =
    filters.priceMin != null || filters.priceMax != null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2",
            "font-display text-xs font-semibold transition-colors",
            activeCount > 0
              ? "bg-maia-orange text-white shadow-sm"
              : "bg-maia-nude/80 text-maia-text ring-1 ring-maia-text/[0.06] active:bg-maia-nude"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
          Filtros
          {activeCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white/25 px-1 text-[10px]">
              {activeCount}
            </span>
          )}
        </button>

        <div
          className="flex flex-1 gap-1.5 overflow-x-auto hide-scrollbar"
          role="group"
          aria-label="Ordenação"
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSortChange(opt.value)}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 font-display text-[11px] font-medium transition-colors",
                filters.sort === opt.value
                  ? "bg-maia-text text-white"
                  : "bg-white text-maia-muted ring-1 ring-maia-text/[0.08] active:bg-maia-nude/60"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {(filters.category ||
        hasPrice ||
        filters.featuredOnly ||
        filters.newOnly) && (
        <div className="flex flex-wrap gap-1.5">
          {filters.category && (
            <FilterChip
              label={
                categories.find((c) => c.slug === filters.category)?.name ??
                filters.category
              }
              onRemove={() => onClearFilter("category")}
            />
          )}
          {hasPrice && (
            <FilterChip
              label="Preço"
              onRemove={() => onClearFilter("price")}
            />
          )}
          {filters.featuredOnly && (
            <FilterChip
              label="Destaques"
              onRemove={() => onClearFilter("featured")}
            />
          )}
          {filters.newOnly && (
            <FilterChip
              label="Lançamentos"
              onRemove={() => onClearFilter("new")}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-maia-orange/10 py-1 pl-2.5 pr-1 font-display text-[11px] font-medium text-maia-orange">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="flex h-5 w-5 items-center justify-center rounded-full active:bg-maia-orange/20"
        aria-label={`Remover filtro ${label}`}
      >
        <X className="h-3 w-3" strokeWidth={2.5} />
      </button>
    </span>
  );
}
