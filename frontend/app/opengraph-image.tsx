import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo/config";

export const runtime = "edge";
export const alt = `${SITE_NAME} — Bolsas personalizadas`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(145deg, #FFF8F5 0%, #F5E6E0 45%, #FF6B00 120%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 48,
            borderRadius: 32,
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 24px 64px rgba(34,34,34,0.08)",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#222222",
              letterSpacing: "-0.02em",
            }}
          >
            {SITE_NAME}
          </span>
          <span
            style={{
              marginTop: 16,
              fontSize: 28,
              color: "#FF6B00",
              fontWeight: 600,
            }}
          >
            Bolsas personalizadas
          </span>
          <span
            style={{
              marginTop: 12,
              fontSize: 22,
              color: "#6B6B6B",
              maxWidth: 520,
              textAlign: "center",
            }}
          >
            Elegância, exclusividade e artesanato sob medida
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
