import { imageUrlsFromProduct } from "../product-images";

type ProductWithRelations = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: { toString(): string } | number;
  imageUrl: string;
  cloudinaryPublicId: string | null;
  featured: boolean;
  isNew: boolean;
  productType: string | null;
  active?: boolean;
  stock: number;
  salesCount?: number;
  viewCount?: number;
  whatsappClicks?: number;
  categoryId: string;
  createdAt?: Date;
  category?: { id: string; slug: string; name: string } | null;
  images?: { url: string; cloudinaryPublicId: string | null; sortOrder: number; isPrimary: boolean; deletedAt?: Date | null }[];
};

export function serializeProduct(product: ProductWithRelations) {
  const imageList = imageUrlsFromProduct(product);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    cloudinaryPublicId: product.cloudinaryPublicId,
    images: imageList,
    featured: product.featured,
    isNew: product.isNew,
    productType: product.productType,
    stock: product.stock,
    inStock: product.stock > 0,
    salesCount: product.salesCount ?? 0,
    createdAt: product.createdAt?.toISOString(),
    categoryId: product.categoryId,
    category: product.category ?? undefined,
  };
}

export function serializeAdminProduct(
  product: ProductWithRelations & {
    whatsappClicks: number;
    viewCount: number;
    salesCount: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  }
) {
  return {
    ...serializeProduct(product),
    active: product.active,
    viewCount: product.viewCount,
    whatsappClicks: product.whatsappClicks,
    salesCount: product.salesCount,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    deletedAt: product.deletedAt?.toISOString() ?? null,
    images: imageUrlsFromProduct(product),
  };
}
