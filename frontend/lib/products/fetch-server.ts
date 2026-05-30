import { serverApiGet } from "@/lib/api/server";
import { ROUTES } from "@/lib/constants/routes";
import type { ApiProductPayload } from "./api-types";
import { normalizeProduct } from "./normalize";
import { pickFeaturedProducts } from "./selectors";
import type { Product } from "./types";

/** Slugs reais para sitemap (somente produtos cadastrados no admin) */
export async function fetchProductSlugsForSitemap(): Promise<
  { slug: string; updatedAt?: string }[]
> {
  const list = await serverApiGet<ApiProductPayload[]>("/products", {
    revalidate: 3600,
    tags: ["products"],
  });

  if (!list?.length) return [];

  return list.map((p) => ({
    slug: p.slug,
    updatedAt: p.createdAt,
  }));
}

/** Produto com cache ISR para SSR / metadata */
export async function fetchProductCached(
  slug: string
): Promise<Product | null> {
  const product = await serverApiGet<ApiProductPayload>(`/products/${slug}`, {
    revalidate: 120,
    tags: ["products", `product-${slug}`],
  });

  if (!product) return null;
  return normalizeProduct(product);
}

/** Relacionados com cache ISR (página de produto) */
export async function fetchRelatedProductsCached(
  slug: string,
  limit = 4
): Promise<Product[]> {
  const related = await serverApiGet<ApiProductPayload[]>(
    `/products/${slug}/related?limit=${limit}`,
    {
      revalidate: 300,
      tags: ["products", `product-${slug}`],
    }
  );

  if (!related?.length) return [];
  return related.map(normalizeProduct);
}

/** Destaques para home (SSR) — apenas produtos da API */
export async function fetchFeaturedProducts(
  limit = 6
): Promise<Product[]> {
  const list = await serverApiGet<ApiProductPayload[]>("/products", {
    revalidate: 300,
    tags: ["products"],
  });

  if (!list?.length) return [];
  return pickFeaturedProducts(list.map(normalizeProduct), limit);
}

export function getProductCanonicalPath(slug: string): string {
  return ROUTES.product(slug);
}
