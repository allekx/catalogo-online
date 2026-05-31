/** PWA do painel admin — instalável separado do catálogo público */
export const ADMIN_PWA_CONFIG = {
  id: "/admin",
  name: "Le Maia Admin",
  shortName: "Admin Le Maia",
  description: "Painel administrativo Le Maia — produtos, categorias e pedidos.",
  themeColor: "#FF6B00",
  backgroundColor: "#f8f6f4",
  startUrl: "/admin/login",
  scope: "/admin",
  display: "standalone" as const,
  orientation: "portrait-primary" as const,
  lang: "pt-BR",
} as const;

export const ADMIN_PWA_STORAGE_KEYS = {
  installDismissed: "le-maia-admin-pwa-install-dismissed",
} as const;
