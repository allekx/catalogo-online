const LOCAL_FALLBACK = "http://localhost:3000";

/**
 * URL pública do site — segura para `new URL()` (metadata, sitemap, SSR).
 * Prioridade: NEXT_PUBLIC_SITE_URL → VERCEL_URL → localhost.
 * Domínios sem protocolo recebem prefixo https://.
 */
export function resolveSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`
      : "");

  if (!raw) {
    return LOCAL_FALLBACK;
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw.replace(/\/$/, "");
  }

  return `https://${raw.replace(/\/$/, "")}`;
}
