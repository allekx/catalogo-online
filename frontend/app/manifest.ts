import type { MetadataRoute } from "next";
import { PWA_CONFIG, PWA_ICON_SIZES } from "@/lib/pwa/config";

export default function manifest(): MetadataRoute.Manifest {
  const icons: MetadataRoute.Manifest["icons"] = [
    {
      src: "/icons/icon.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any",
    },
    ...PWA_ICON_SIZES.flatMap((size) => [
      {
        src: `/icons/${size}`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "any" as const,
      },
      {
        src: `/icons/${size}?maskable=1`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "maskable" as const,
      },
    ]),
  ];

  return {
    id: PWA_CONFIG.scope,
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
    icons,
    screenshots: [],
  };
}
