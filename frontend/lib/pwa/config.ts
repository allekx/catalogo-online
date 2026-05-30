import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo/config";

export const PWA_CONFIG = {
  name: `${SITE_NAME} — Bolsas Personalizadas`,
  shortName: SITE_NAME,
  description: SITE_DESCRIPTION,
  themeColor: "#FF6B00",
  backgroundColor: "#FFF8F5",
  startUrl: "/",
  scope: "/",
  display: "standalone" as const,
  orientation: "portrait-primary" as const,
  lang: "pt-BR",
  categories: ["shopping", "lifestyle"] as const,
};

export const PWA_ICON_SIZES = [192, 512] as const;

export const PWA_STORAGE_KEYS = {
  installDismissed: "le-maia-pwa-install-dismissed",
  splashSeen: "le-maia-pwa-splash-seen",
} as const;
