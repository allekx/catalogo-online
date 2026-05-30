import { ImageResponse } from "next/og";
import { PwaIconContent } from "@/lib/pwa/icon-content";

export const runtime = "edge";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<PwaIconContent size={32} />, size);
}
