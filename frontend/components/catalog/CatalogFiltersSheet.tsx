"use client";

import { BottomSheet, Button } from "@/design-system";
import {
  CATALOG_CATEGORIES,
  PRICE_RANGES,
  SORT_OPTIONS,
  getPriceRangeId,
} from "@/lib/catalog";
import type { CatalogFilters } from "@/lib/catalog/types";
import { DEFAULT_CATALOG_FILTERS } from "@/lib/catalog/types";
import { cn } from "@/lib/utils/cn";

interface CatalogFiltersSheetProps {
  open: boolean;
  onClose: () => void;
  draft: CatalogFilters;
  onChange: (next: CatalogFilters) => void;
  onApply: () => void;
  resultCount: number;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3.5 py-2 font-display text-xs font-medium transition-colors",
        active
          ? "bg-maia-orange text-white shadow-sm"
          : "bg-maia-nude/70 text-maia-text ring-1 ring-maia-text/[0.06] active:bg-maia-nude"
      )}
    >
      {children}
    </button>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-maia-nude/40 px-4 py-3 ring-1 ring-maia-text/[0.04]">
      <div>
        <span className="font-display text-sm font-medium text-maia-text">
          {label}
        </span>
        {description && (
          <p className="mt-0.5 font-body text-[11px] text-maia-muted">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-maia-orange" : "bg-maia-rose/80"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}

export function CatalogFiltersSheet({
  open,
  onClose,
  draft,
  onChange,
  onApply,
  resultCount,
}: CatalogFiltersSheetProps) {
  const priceRangeId = getPriceRangeId(draft.priceMin, draft.priceMax);

  const setPriceRange = (id: string) => {
    const range = PRICE_RANGES.find((r) => r.id === id) ?? PRICE_RANGES[0];
    onChange({
      ...draft,
      priceMin: range.min,
      priceMax: range.max,
    });
  };

  const handleClear = () => {
    onChange({
      ...DEFAULT_CATALOG_FILTERS,
      query: draft.query,
      sort: draft.sort,
    });
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Filtros e ordenação">
      <div className="max-h-[min(70vh,520px)] space-y-6 overflow-y-auto pb-2 hide-scrollbar">
        <section>
          <h3 className="mb-2.5 font-display text-xs font-semibold uppercase tracking-wider text-maia-muted">
            Ordenar
          </h3>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                active={draft.sort === opt.value}
                onClick={() => onChange({ ...draft, sort: opt.value })}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2.5 font-display text-xs font-semibold uppercase tracking-wider text-maia-muted">
            Categoria
          </h3>
          <div className="flex flex-wrap gap-2">
            <Chip
              active={!draft.category}
              onClick={() => onChange({ ...draft, category: null })}
            >
              Todas
            </Chip>
            {CATALOG_CATEGORIES.map((cat) => (
              <Chip
                key={cat.slug}
                active={draft.category === cat.slug}
                onClick={() =>
                  onChange({
                    ...draft,
                    category:
                      draft.category === cat.slug ? null : cat.slug,
                  })
                }
              >
                {cat.name}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2.5 font-display text-xs font-semibold uppercase tracking-wider text-maia-muted">
            Faixa de preço
          </h3>
          <div className="flex flex-wrap gap-2">
            {PRICE_RANGES.map((range) => (
              <Chip
                key={range.id}
                active={priceRangeId === range.id}
                onClick={() => setPriceRange(range.id)}
              >
                {range.label}
              </Chip>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-maia-muted">
            Coleções
          </h3>
          <Toggle
            label="Destaques"
            description="Peças em evidência na loja"
            checked={draft.featuredOnly}
            onChange={(featuredOnly) => onChange({ ...draft, featuredOnly })}
          />
          <Toggle
            label="Lançamentos"
            description="Novidades da temporada"
            checked={draft.newOnly}
            onChange={(newOnly) => onChange({ ...draft, newOnly })}
          />
        </section>
      </div>

      <div className="mt-4 flex gap-2 border-t border-maia-text/[0.06] pt-4">
        <Button variant="secondary" className="flex-1" onClick={handleClear}>
          Limpar
        </Button>
        <Button
          variant="primary"
          className="flex-[1.4]"
          onClick={() => {
            onApply();
            onClose();
          }}
        >
          Ver {resultCount} {resultCount === 1 ? "peça" : "peças"}
        </Button>
      </div>
    </BottomSheet>
  );
}
