export type CatalogSort =
  | "recent"
  | "price-asc"
  | "price-desc"
  | "bestsellers";

export interface CatalogFilters {
  query: string;
  category: string | null;
  priceMin: number | null;
  priceMax: number | null;
  featuredOnly: boolean;
  newOnly: boolean;
  sort: CatalogSort;
}

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  query: "",
  category: null,
  priceMin: null,
  priceMax: null,
  featuredOnly: false,
  newOnly: false,
  sort: "recent",
};
