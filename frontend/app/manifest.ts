import type { MetadataRoute } from "next";
import { PWA_CONFIG } from "@/lib/pwa/config";
import { buildManifestIcons } from "@/lib/pwa/manifest-json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/catalogo",
    name: PWA_CONFIG.name,
    short_name: PWA_CONFIG.shortName,
    description: PWA_CONFIG.description,
    start_url: PWA_CONFIG.startUrl,
    scope: PWA_CONFIG.scope,
    display: PWA_CONFIG.display,
    orientation: PWA_CONFIG.orientation,
    lang: PWA_CONFIG.lang,
    dir: "ltr",
    theme_color: PWA_CONFIG.themeColor,
    background_color: PWA_CONFIG.backgroundColor,
    categories: [...PWA_CONFIG.categories],
    prefer_related_applications: false,
    icons: buildManifestIcons(),
    screenshots: [],
  };
}
