import type { CatalogFilters, CatalogSort } from "./types";
import { DEFAULT_CATALOG_FILTERS } from "./types";
import { PRICE_RANGES } from "./constants";

const SORT_VALUES: CatalogSort[] = [
  "recent",
  "price-asc",
  "price-desc",
  "bestsellers",
];

function parseSort(value: string | null): CatalogSort {
  if (value && SORT_VALUES.includes(value as CatalogSort)) {
    return value as CatalogSort;
  }
  return DEFAULT_CATALOG_FILTERS.sort;
}

function parsePriceRange(
  id: string | null
): Pick<CatalogFilters, "priceMin" | "priceMax"> {
  const range = PRICE_RANGES.find((r) => r.id === id);
  if (!range || id === "all") {
    return { priceMin: null, priceMax: null };
  }
  return { priceMin: range.min, priceMax: range.max };
}

export function filtersFromSearchParams(
  params: URLSearchParams
): CatalogFilters {
  const priceRangeId = params.get("preco");
  const price = parsePriceRange(priceRangeId);

  const minParam = params.get("preco_min");
  const maxParam = params.get("preco_max");

  return {
    query: params.get("busca") ?? "",
    category: params.get("categoria") || null,
    priceMin: minParam ? Number(minParam) : price.priceMin,
    priceMax: maxParam ? Number(maxParam) : price.priceMax,
    featuredOnly: params.get("destaque") === "1",
    newOnly: params.get("lancamento") === "1",
    sort: parseSort(params.get("ordenar")),
  };
}

export function searchParamsFromFilters(
  filters: CatalogFilters
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.query.trim()) {
    params.set("busca", filters.query.trim());
  }
  if (filters.category) {
    params.set("categoria", filters.category);
  }

  const range = PRICE_RANGES.find(
    (r) => r.min === filters.priceMin && r.max === filters.priceMax
  );
  if (range && range.id !== "all") {
    params.set("preco", range.id);
  } else {
    if (filters.priceMin != null) {
      params.set("preco_min", String(filters.priceMin));
    }
    if (filters.priceMax != null) {
      params.set("preco_max", String(filters.priceMax));
    }
  }

  if (filters.featuredOnly) params.set("destaque", "1");
  if (filters.newOnly) params.set("lancamento", "1");
  if (filters.sort !== DEFAULT_CATALOG_FILTERS.sort) {
    params.set("ordenar", filters.sort);
  }

  return params;
}

export function getPriceRangeId(
  priceMin: number | null,
  priceMax: number | null
): string {
  const match = PRICE_RANGES.find(
    (r) => r.min === priceMin && r.max === priceMax
  );
  return match?.id ?? "all";
}
