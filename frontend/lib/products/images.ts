import { getProductImageUrl } from "@/lib/cloudinary";
import type { Product } from "./types";

export function getAllGalleryUrls(product: Product): string[] {
  const urls = [product.imageUrl, ...(product.images ?? [])];
  return Array.from(new Set(urls.filter(Boolean)));
}

/** URLs otimizadas (Cloudinary q_auto, f_auto) para next/image */
export function getOptimizedGalleryUrls(product: Product): string[] {
  const raw = getAllGalleryUrls(product);
  return raw.map((url, index) =>
    getProductImageUrl(
      url,
      index === 0 ? product.cloudinaryPublicId : null,
      index === 0 ? "full" : "card"
    )
  );
}

export function getOptimizedThumbUrl(
  url: string,
  publicId?: string | null
): string {
  return getProductImageUrl(url, publicId, "thumb");
}
