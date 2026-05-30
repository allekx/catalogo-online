import { api } from "@/services/api";
import { normalizeProduct } from "./normalize";
import type { Product } from "./types";

/** Carrega catálogo completo para busca/filtros no cliente */
export async function fetchAllCatalogProducts(): Promise<Product[]> {
  return fetchProducts();
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const product = await api.products.get(slug);
    return normalizeProduct(product);
  } catch {
    return null;
  }
}

export async function fetchProducts(params?: {
  categoria?: string;
  busca?: string;
}): Promise<Product[]> {
  try {
    const list = await api.products.list(params);
    return list.map(normalizeProduct);
  } catch {
    return [];
  }
}

export async function fetchRelatedProducts(
  slug: string,
  limit = 4
): Promise<Product[]> {
  try {
    const related = await api.products.related(slug, limit);
    return related.map(normalizeProduct);
  } catch {
    return [];
  }
}

export { normalizeProduct };
