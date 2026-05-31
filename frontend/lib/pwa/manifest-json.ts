import type { MetadataRoute } from "next";
import { PWA_ICON_SIZES } from "@/lib/pwa/config";

export function buildManifestIcons(): MetadataRoute.Manifest["icons"] {
  return [
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
}
