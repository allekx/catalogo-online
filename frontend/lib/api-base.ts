import { resolveSiteUrl } from "@/lib/seo/resolve-site-url";

/**
 * Base URL da API — mesmo origin no Vercel (/api).
 * Em SSR usa URL absoluta (site público resolvido com segurança).
 */
export function getApiBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return "/api";
  }

  return `${resolveSiteUrl()}/api`;
}
