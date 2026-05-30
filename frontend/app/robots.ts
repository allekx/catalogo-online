import type { MetadataRoute } from "next";
import { NOINDEX_ROUTES, SITE_URL } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: NOINDEX_ROUTES,
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
