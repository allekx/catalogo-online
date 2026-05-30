import type { Metadata } from "next";
import { getProductImageUrl } from "@/lib/cloudinary";
import {
  DEFAULT_OG_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "./config";

const defaultOgImage = {
  url: DEFAULT_OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — Bolsas personalizadas`,
};

export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface PageMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  ogImage?: string | { url: string; width?: number; height?: number; alt?: string };
}

/** Metadata consistente para páginas estáticas */
export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  noIndex = false,
  ogImage,
}: PageMetadataOptions): Metadata {
  const canonical = path ? absoluteUrl(path) : undefined;
  const image =
    typeof ogImage === "string"
      ? { url: ogImage, width: 1200, height: 630, alt: title }
      : ogImage ?? defaultOgImage;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "pt_BR",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [typeof image === "object" && "url" in image ? image.url : image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export interface ProductMetadataInput {
  name: string;
  description: string;
  slug: string;
  price: number;
  imageUrl: string;
  cloudinaryPublicId?: string | null;
  inStock?: boolean;
  categoryName?: string;
}

export function buildProductMetadata(product: ProductMetadataInput): Metadata {
  const description = product.description.slice(0, 160);
  const path = `/catalogo/${product.slug}`;
  const canonical = absoluteUrl(path);
  const ogUrl = getProductImageUrl(
    product.imageUrl,
    product.cloudinaryPublicId,
    "og"
  );

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: SITE_NAME,
      title: product.name,
      description,
      url: canonical,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [ogUrl],
    },
    robots: { index: true, follow: true },
  };
}

export { SITE_NAME, SITE_DESCRIPTION, SITE_URL, DEFAULT_OG_IMAGE_PATH };
export { defaultOgImage };
