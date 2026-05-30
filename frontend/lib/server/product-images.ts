import { prisma } from "./prisma";
import { notDeleted } from "./db";

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

  await prisma.product.update({
    where: { id: productId },
    data: {
      imageUrl: urls[0],
      cloudinaryPublicId: cloudinaryIds?.[0] ?? null,
    },
  });
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
