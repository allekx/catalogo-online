/**
 * Base URL da API — mesmo origin no Vercel (/api).
 * Em SSR usa URL absoluta (NEXT_PUBLIC_SITE_URL ou VERCEL_URL).
 */
export function getApiBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return "/api";
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  return `${site}/api`;
}
