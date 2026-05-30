import { PRODUCT_TYPES } from "./constants";
import type { CatalogFilters, CatalogSort } from "./types";
import type { Product } from "@/lib/products/types";

export function getProductTypeLabel(type?: string): string {
  if (!type) return "";
  return PRODUCT_TYPES.find((t) => t.slug === type)?.label ?? type;
}

function matchesQuery(product: Product, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;

  const typeLabel = getProductTypeLabel(product.productType).toLowerCase();
  const haystack = [
    product.name,
    product.description,
    product.category?.name,
    product.category?.slug,
    product.productType,
    typeLabel,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function sortProducts(products: Product[], sort: CatalogSort): Product[] {
  const list = [...products];

  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "bestsellers":
      return list.sort(
        (a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0)
      );
    case "recent":
    default:
      return list.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
  }
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters
): Product[] {
  let result = products.filter((p) => matchesQuery(p, filters.query));

  if (filters.category) {
    result = result.filter((p) => p.category?.slug === filters.category);
  }

  if (filters.priceMin != null) {
    result = result.filter((p) => p.price >= filters.priceMin!);
  }

  if (filters.priceMax != null) {
    result = result.filter((p) => p.price <= filters.priceMax!);
  }

  if (filters.featuredOnly) {
    result = result.filter((p) => p.featured);
  }

  if (filters.newOnly) {
    result = result.filter((p) => p.isNew);
  }

  return sortProducts(result, filters.sort);
}

export function countActiveFilters(filters: CatalogFilters): number {
  let n = 0;
  if (filters.category) n += 1;
  if (filters.priceMin != null || filters.priceMax != null) n += 1;
  if (filters.featuredOnly) n += 1;
  if (filters.newOnly) n += 1;
  return n;
}
