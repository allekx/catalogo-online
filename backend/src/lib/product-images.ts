import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { notDeleted } from "./db";

export interface ImageInput {
  url: string;
  cloudinaryPublicId?: string | null;
  altText?: string | null;
}

/** Sincroniza galeria: substitui imagens ativas do produto */
export async function syncProductImages(
  productId: string,
  imageUrls: string[],
  cloudinaryIds?: (string | null | undefined)[]
): Promise<void> {
  const urls = imageUrls.filter(Boolean);
  if (!urls.length) return;

  await prisma.productImage.updateMany({
    where: { productId, ...notDeleted },
    data: { deletedAt: new Date() },
  });

  await prisma.productImage.createMany({
    data: urls.map((url, index) => ({
      productId,
      url,
      cloudinaryPublicId: cloudinaryIds?.[index] ?? null,
      sortOrder: index,
      isPrimary: index === 0,
    })),
  });

  const primary = urls[0];
  await prisma.product.update({
    where: { id: productId },
    data: {
      imageUrl: primary,
      cloudinaryPublicId: cloudinaryIds?.[0] ?? null,
    },
  });
}

export function getPrimaryImage(
  images: { url: string; cloudinaryPublicId: string | null; isPrimary: boolean }[],
  fallbackUrl: string
): { url: string; cloudinaryPublicId: string | null } {
  const primary = images.find((i) => i.isPrimary) ?? images[0];
  return {
    url: primary?.url ?? fallbackUrl,
    cloudinaryPublicId: primary?.cloudinaryPublicId ?? null,
  };
}

export function imageUrlsFromProduct(product: {
  imageUrl: string;
  images?: { url: string; deletedAt?: Date | null }[];
}): string[] {
  const fromRelation = (product.images ?? [])
    .filter((i) => !i.deletedAt)
    .map((i) => i.url);
  if (fromRelation.length) return fromRelation;
  return product.imageUrl ? [product.imageUrl] : [];
}
