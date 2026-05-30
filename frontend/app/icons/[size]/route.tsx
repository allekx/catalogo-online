import { ImageResponse } from "next/og";
import { PwaIconContent } from "@/lib/pwa/icon-content";
import { PWA_ICON_SIZES } from "@/lib/pwa/config";

export const runtime = "edge";

const ALLOWED = new Set<string>(PWA_ICON_SIZES.map(String));

export function generateStaticParams() {
  return PWA_ICON_SIZES.map((size) => ({ size: String(size) }));
}

export async function GET(
  request: Request,
  { params }: { params: { size: string } }
) {
  const { searchParams } = new URL(request.url);
  const maskable = searchParams.get("maskable") === "1";
  const sizeNum = ALLOWED.has(params.size) ? Number(params.size) : 192;
  const pad = maskable ? Math.round(sizeNum * 0.1) : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: maskable ? "#FF6B00" : "transparent",
          padding: pad,
        }}
      >
        <PwaIconContent size={sizeNum - pad * 2} />
      </div>
    ),
    { width: sizeNum, height: sizeNum }
  );
}
