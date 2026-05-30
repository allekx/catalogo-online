import type { Product } from "./types";

export function pickFeaturedProducts(
  products: Product[],
  limit = 6
): Product[] {
  const featured = products.filter((p) => p.featured);
  const pool = featured.length > 0 ? featured : products;
  return pool.slice(0, limit);
}
