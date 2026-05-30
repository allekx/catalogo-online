import type { ApiProductPayload } from "./api-types";
import type { Product } from "./types";

/** Normaliza payload da API para o modelo de domínio */
export function normalizeProduct(
  payload: ApiProductPayload | Product
): Product {
  const stock = typeof payload.stock === "number" ? payload.stock : 0;

  return {
    id: payload.id,
    slug: payload.slug,
    name: payload.name,
    description: payload.description ?? "",
    price: Number(payload.price),
    imageUrl: payload.imageUrl,
    cloudinaryPublicId: payload.cloudinaryPublicId,
    images: payload.images ?? [],
    featured: Boolean(payload.featured),
    stock,
    inStock:
      "inStock" in payload && payload.inStock !== undefined
        ? Boolean(payload.inStock)
        : stock > 0,
    categoryId: payload.categoryId,
    category: payload.category,
    productType:
      "productType" in payload && payload.productType
        ? payload.productType
        : undefined,
    isNew: "isNew" in payload ? Boolean(payload.isNew) : false,
    salesCount:
      "salesCount" in payload && payload.salesCount != null
        ? payload.salesCount
        : 0,
    createdAt:
      "createdAt" in payload && payload.createdAt
        ? payload.createdAt
        : undefined,
  };
}
