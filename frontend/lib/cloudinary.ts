import { clientEnv } from "./env";

export type CloudinaryTransform = {
  width?: number;
  height?: number;
  crop?: "fill" | "limit" | "scale" | "thumb";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg";
};

/**
 * Gera URL otimizada do Cloudinary para next/image ou <img>.
 * @see https://cloudinary.com/documentation/image_transformations
 */
export function getCloudinaryUrl(
  publicIdOrUrl: string,
  transform: CloudinaryTransform = {}
): string {
  const cloudName = clientEnv.cloudinaryCloudName;

  if (!cloudName) {
    return publicIdOrUrl;
  }

  if (publicIdOrUrl.startsWith("http")) {
    if (publicIdOrUrl.includes("res.cloudinary.com")) {
      return applyTransformToExistingUrl(publicIdOrUrl, transform);
    }
    return publicIdOrUrl;
  }

  const parts: string[] = [];

  if (transform.width || transform.height) {
    const w = transform.width ? `w_${transform.width}` : "";
    const h = transform.height ? `h_${transform.height}` : "";
    const crop = transform.crop ?? "limit";
    parts.push(`${w}${w && h ? "," : ""}${h},c_${crop}`);
  }

  parts.push(`q_${transform.quality ?? "auto"}`);
  parts.push(`f_${transform.format ?? "auto"}`);

  const transformation = parts.filter(Boolean).join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicIdOrUrl}`;
}

function applyTransformToExistingUrl(
  url: string,
  transform: CloudinaryTransform
): string {
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;

  const parts: string[] = [];
  if (transform.width) parts.push(`w_${transform.width}`);
  if (transform.height) parts.push(`h_${transform.height}`);
  parts.push(`q_${transform.quality ?? "auto"}`, `f_${transform.format ?? "auto"}`);

  const segment = parts.join(",");
  return `${url.slice(0, uploadIndex + 8)}${segment}/${url.slice(uploadIndex + 8)}`;
}

export type ProductImageSize = "thumb" | "card" | "full" | "og";

export function getProductImageUrl(
  imageUrl: string,
  publicId?: string | null,
  size: ProductImageSize = "card"
): string {
  const sizes = { thumb: 240, card: 480, full: 1200, og: 1200 };
  const width = sizes[size];
  const height = size === "og" ? 630 : undefined;

  const transform: CloudinaryTransform = {
    width,
    ...(height ? { height, crop: "fill" } : { crop: "limit" }),
    quality: "auto",
    format: "auto",
  };

  if (publicId && clientEnv.cloudinaryCloudName) {
    return getCloudinaryUrl(publicId, transform);
  }

  return getCloudinaryUrl(imageUrl, transform);
}
