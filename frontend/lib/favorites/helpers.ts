import type { Product } from "@/lib/products/types";
import type { FavoriteItem, FavoriteProductInput } from "./types";

export function productToFavoriteItem(
  product: FavoriteProductInput
): FavoriteItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    categoryName: product.category?.name,
    cloudinaryPublicId: product.cloudinaryPublicId ?? null,
    addedAt: Date.now(),
  };
}

/** Reconstrói produto a partir dos dados salvos localmente (sem mock) */
export function favoriteItemToProduct(item: FavoriteItem): Product {
  return {
    id: item.productId,
    slug: item.slug,
    name: item.name,
    description: "",
    price: item.price,
    imageUrl: item.imageUrl,
    cloudinaryPublicId: item.cloudinaryPublicId,
    images: [item.imageUrl],
    featured: false,
    stock: 1,
    inStock: true,
    categoryId: "",
    category: item.categoryName
      ? { id: "", slug: "", name: item.categoryName }
      : undefined,
  };
}

export function isValidFavoriteItem(item: unknown): item is FavoriteItem {
  if (!item || typeof item !== "object") return false;
  const row = item as FavoriteItem;
  return (
    typeof row.productId === "string" &&
    row.productId.length > 0 &&
    typeof row.slug === "string" &&
    row.slug.length > 0 &&
    typeof row.name === "string" &&
    typeof row.price === "number" &&
    Number.isFinite(row.price) &&
    typeof row.imageUrl === "string" &&
    row.imageUrl.length > 0
  );
}

/** Remove formatos legados (IDs soltos, mocks, objetos incompletos) */
export function sanitizeFavoriteItems(raw: unknown): FavoriteItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(isValidFavoriteItem)
    .filter((item) => !item.productId.startsWith("mock-"));
}

export function resolveFavoriteProducts(items: FavoriteItem[]): Product[] {
  return sanitizeFavoriteItems(items).map(favoriteItemToProduct);
}
