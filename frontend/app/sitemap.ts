import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/constants/routes";
import { STATIC_SITEMAP_ROUTES, SITE_URL } from "@/lib/seo/config";
import { fetchProductSlugsForSitemap } from "@/lib/products/fetch-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_SITEMAP_ROUTES.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  const slugs = await fetchProductSlugsForSitemap();
  const productEntries: MetadataRoute.Sitemap = slugs.map(
    ({ slug, updatedAt }) => ({
      url: `${base}${ROUTES.product(slug)}`,
      lastModified: updatedAt ? new Date(updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  return [...staticEntries, ...productEntries];
}
