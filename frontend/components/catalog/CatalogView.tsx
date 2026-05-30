"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Typography, ProductGridSkeleton, Button, ScrollReveal } from "@/design-system";
import { fadeIn, duration, easePremium } from "@/design-system/motion/config";
import { ProductGrid } from "./ProductGrid";
import { CatalogSearchBar } from "./CatalogSearchBar";
import { CatalogToolbar } from "./CatalogToolbar";
import dynamic from "next/dynamic";

const CatalogFiltersSheet = dynamic(
  () =>
    import("./CatalogFiltersSheet").then((m) => ({
      default: m.CatalogFiltersSheet,
    })),
  { ssr: false }
);
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  filterProducts,
  filtersFromSearchParams,
  searchParamsFromFilters,
} from "@/lib/catalog";
import { useCatalogCategories } from "@/hooks/useCatalogCategories";
import type { CatalogFilters } from "@/lib/catalog/types";
import { DEFAULT_CATALOG_FILTERS } from "@/lib/catalog/types";
import { fetchAllCatalogProducts } from "@/lib/products/fetch";
import { ROUTES } from "@/lib/constants/routes";
import type { Product } from "@/lib/products/types";

function getPageTitle(
  filters: CatalogFilters,
  count: number,
  categoryName?: string
): string {
  if (filters.query.trim()) {
    return `“${filters.query.trim()}”`;
  }
  if (filters.category) {
    return categoryName ?? filters.category;
  }
  return count > 0 ? "Catálogo" : "Catálogo";
}

export function CatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, findBySlug } = useCatalogCategories();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<CatalogFilters>(() =>
    filtersFromSearchParams(searchParams)
  );
  const [draftFilters, setDraftFilters] = useState<CatalogFilters>(filters);
  const [queryInput, setQueryInput] = useState(filters.query);

  const debouncedQuery = useDebouncedValue(queryInput, 180);

  useEffect(() => {
    fetchAllCatalogProducts()
      .then(setAllProducts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const next = filtersFromSearchParams(searchParams);
    setFilters(next);
    setDraftFilters(next);
    setQueryInput(next.query);
  }, [searchParams]);

  const syncUrl = useCallback(
    (next: CatalogFilters) => {
      const params = searchParamsFromFilters(next);
      const qs = params.toString();
      router.replace(qs ? `${ROUTES.catalog}?${qs}` : ROUTES.catalog, {
        scroll: false,
      });
    },
    [router]
  );

  const appliedFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [filters, debouncedQuery]
  );

  const filteredProducts = useMemo(
    () => filterProducts(allProducts, appliedFilters),
    [allProducts, appliedFilters]
  );

  const draftResults = useMemo(
    () => filterProducts(allProducts, { ...draftFilters, query: debouncedQuery }),
    [allProducts, draftFilters, debouncedQuery]
  );

  useEffect(() => {
    setFilters((prev) => {
      if (prev.query === debouncedQuery) return prev;
      const next = { ...prev, query: debouncedQuery };
      syncUrl(next);
      return next;
    });
  }, [debouncedQuery, syncUrl]);

  const handleSortChange = (sort: CatalogFilters["sort"]) => {
    const next = { ...filters, query: debouncedQuery, sort };
    setFilters(next);
    setDraftFilters((d) => ({ ...d, sort }));
    syncUrl(next);
  };

  const handleApplyFilters = () => {
    const next = { ...draftFilters, query: debouncedQuery };
    setFilters(next);
    syncUrl(next);
  };

  const handleClearFilter = (key: "category" | "price" | "featured" | "new") => {
    const patch: Partial<CatalogFilters> = {};
    if (key === "category") patch.category = null;
    if (key === "price") {
      patch.priceMin = null;
      patch.priceMax = null;
    }
    if (key === "featured") patch.featuredOnly = false;
    if (key === "new") patch.newOnly = false;
    const next = { ...filters, query: debouncedQuery, ...patch };
    setFilters(next);
    setDraftFilters((d) => ({ ...d, ...patch }));
    syncUrl(next);
  };

  const title = getPageTitle(
    appliedFilters,
    filteredProducts.length,
    findBySlug(appliedFilters.category)?.name
  );
  const subtitle =
    loading
      ? "Carregando coleção..."
      : filteredProducts.length > 0
        ? `${filteredProducts.length} peça(s) encontrada(s)`
        : appliedFilters.query ||
            appliedFilters.category ||
            appliedFilters.featuredOnly ||
            appliedFilters.newOnly
          ? "Tente outros termos ou filtros"
          : allProducts.length === 0
            ? "Cadastre produtos no painel admin para exibir aqui"
            : "Explore nossa coleção completa";

  return (
    <div className="-mx-4 flex flex-col sm:-mx-6 lg:mx-0">
      <div
        className="sticky z-40 border-b border-maia-text/[0.06] bg-[#FAFAFA]/95 px-4 pb-3 pt-1 backdrop-blur-xl backdrop-saturate-150 sm:px-6 lg:rounded-2xl lg:border lg:px-4"
        style={{
          top: "calc(var(--nav-height) + env(safe-area-inset-top, 0px) - 0.5rem)",
        }}
      >
        <CatalogSearchBar
          value={queryInput}
          onChange={setQueryInput}
          className="mb-2.5"
        />
        <CatalogToolbar
          filters={{ ...filters, query: debouncedQuery }}
          categories={categories}
          onOpenFilters={() => {
            setDraftFilters({ ...filters, query: debouncedQuery });
            setFiltersOpen(true);
          }}
          onSortChange={handleSortChange}
          onClearFilter={handleClearFilter}
        />
      </div>

      <div className="px-4 pt-4 sm:px-6">
        <Typography variant="display-sm" className="mb-1">
          {title}
        </Typography>
        <Typography variant="body-sm" className="mb-5 text-maia-muted">
          {subtitle}
        </Typography>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : filteredProducts.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`${debouncedQuery}-${filters.category}-${filters.sort}-${filters.featuredOnly}-${filters.newOnly}-${filters.priceMin}-${filters.priceMax}`}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: duration.fast, ease: easePremium }}
            >
              <ProductGrid products={filteredProducts} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <ScrollReveal variant="slideUpSubtle" className="rounded-3xl bg-maia-nude/40 p-10 text-center">
            <span className="text-4xl" aria-hidden>
              👜
            </span>
            <Typography variant="body-sm" className="mt-4 text-maia-muted">
              Nenhum produto encontrado.
            </Typography>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQueryInput("");
                const next = { ...DEFAULT_CATALOG_FILTERS };
                setFilters(next);
                setDraftFilters(next);
                syncUrl(next);
              }}
            >
              Limpar busca e filtros
            </Button>
          </ScrollReveal>
        )}
      </div>

      <CatalogFiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        categories={categories}
        draft={{ ...draftFilters, query: debouncedQuery }}
        onChange={setDraftFilters}
        onApply={handleApplyFilters}
        resultCount={draftResults.length}
      />
    </div>
  );
}
