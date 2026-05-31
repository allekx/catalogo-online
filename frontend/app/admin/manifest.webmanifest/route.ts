import { NextResponse } from "next/server";
import { ADMIN_PWA_CONFIG } from "@/lib/pwa/admin-config";
import { buildManifestIcons } from "@/lib/pwa/manifest-json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const manifest = {
    id: ADMIN_PWA_CONFIG.id,
    name: ADMIN_PWA_CONFIG.name,
    short_name: ADMIN_PWA_CONFIG.shortName,
    description: ADMIN_PWA_CONFIG.description,
    start_url: ADMIN_PWA_CONFIG.startUrl,
    scope: ADMIN_PWA_CONFIG.scope,
    display: ADMIN_PWA_CONFIG.display,
    orientation: ADMIN_PWA_CONFIG.orientation,
    lang: ADMIN_PWA_CONFIG.lang,
    dir: "ltr",
    theme_color: ADMIN_PWA_CONFIG.themeColor,
    background_color: ADMIN_PWA_CONFIG.backgroundColor,
    prefer_related_applications: false,
    icons: buildManifestIcons(),
    screenshots: [],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
