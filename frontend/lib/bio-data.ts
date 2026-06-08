import { ROUTES } from "@/lib/constants/routes";
import { SOCIAL } from "@/lib/constants/social";
import { PWA_CONFIG } from "@/lib/pwa/config";
import { fetchFeaturedProducts } from "@/lib/products/fetch-server";
import { SITE_NAME } from "@/lib/seo/config";
import { resolveSiteUrl } from "@/lib/seo/resolve-site-url";
import type { BioPageData } from "@/types/bio";

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1590874103328-e74607b9df31?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1584917865442-de89a76e5528?w=400&h=400&fit=crop",
];

const GALLERY_LIMIT = 6;

/** Caminho relativo — evita next/image com hostname localhost em dev */
function getLogoUrl(): string {
  const custom = process.env.NEXT_PUBLIC_SITE_LOGO_URL?.trim();
  if (custom) {
    if (custom.startsWith("/")) return custom;
    if (custom.startsWith("http")) {
      try {
        const siteOrigin = new URL(resolveSiteUrl()).origin;
        const url = new URL(custom);
        if (url.origin === siteOrigin) {
          return `${url.pathname}${url.search}`;
        }
      } catch {
        /* URL externa — BioHero usa next/image */
      }
      return custom;
    }
    return `/${custom}`;
  }
  return "/icons/512";
}

function getDescription(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_TAGLINE?.trim() ||
    process.env.NEXT_PUBLIC_SITE_BIO_DESCRIPTION?.trim() ||
    "Bolsas Personalizadas e Artesanais"
  );
}

async function fetchGalleryUrls(): Promise<string[]> {
  try {
    const products = await fetchFeaturedProducts(GALLERY_LIMIT);
    const urls = products.map((p) => p.imageUrl).filter(Boolean);
    if (urls.length > 0) return urls;
  } catch (error) {
    console.error("[bio] gallery", error);
  }
  return [...DEFAULT_GALLERY];
}

/** Dados da bio — reutiliza catálogo/env, sem CMS separado */
export async function getBioPageData(): Promise<BioPageData> {
  const companyName =
    process.env.NEXT_PUBLIC_SITE_NAME?.trim() || SITE_NAME;
  const gallery = await fetchGalleryUrls();

  const reviewsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL?.trim() ||
    `https://www.google.com/search?q=${encodeURIComponent(`${companyName} bolsas avaliações`)}`;

  return {
    companyName,
    logo: getLogoUrl(),
    description: getDescription(),
    links: {
      catalog: ROUTES.catalog,
      whatsapp: SOCIAL.whatsapp.url,
      instagram: SOCIAL.instagram,
      promotions: `${ROUTES.catalog}?destaque=true`,
      reviews: reviewsUrl,
    },
    gallery,
    theme: {
      primaryColor:
        process.env.NEXT_PUBLIC_THEME_PRIMARY?.trim() ||
        PWA_CONFIG.themeColor,
      secondaryColor:
        process.env.NEXT_PUBLIC_THEME_SECONDARY?.trim() ||
        PWA_CONFIG.backgroundColor,
    },
  };
}
