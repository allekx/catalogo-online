import { ImageResponse } from "next/og";
import { PwaIconContent } from "@/lib/pwa/icon-content";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<PwaIconContent size={180} />, size);
}
