import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FF6B00",
};

/** Layout isolado — sem navbar do catálogo (ver MainLayout) */
export default function BioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
