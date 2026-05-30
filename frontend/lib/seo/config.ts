import { ROUTES } from "@/lib/constants/routes";

export const SITE_NAME = "Le Maia";
export const SITE_DESCRIPTION =
  "Catálogo premium de bolsas personalizadas femininas. Monte seu pedido e finalize pelo WhatsApp — sem cadastro.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Rotas indexáveis no sitemap */
export const STATIC_SITEMAP_ROUTES = [
  { path: ROUTES.home, priority: 1, changeFrequency: "daily" as const },
  { path: ROUTES.catalog, priority: 0.9, changeFrequency: "daily" as const },
  { path: ROUTES.categories, priority: 0.85, changeFrequency: "weekly" as const },
  { path: ROUTES.about, priority: 0.6, changeFrequency: "monthly" as const },
];

/** Rotas utilitárias — não indexar (carrinho/favoritos são locais ao dispositivo) */
export const NOINDEX_ROUTES = [ROUTES.cart, ROUTES.favorites];

export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image";
