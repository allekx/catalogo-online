import type { Metadata } from "next";
import { ADMIN_PWA_CONFIG } from "@/lib/pwa/admin-config";

export const metadata: Metadata = {
  title: "Admin — Le Maia",
  robots: { index: false, follow: false },
  manifest: "/admin/manifest.webmanifest",
  applicationName: ADMIN_PWA_CONFIG.shortName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: ADMIN_PWA_CONFIG.shortName,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-root">{children}</div>;
}
