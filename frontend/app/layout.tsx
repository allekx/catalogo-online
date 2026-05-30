import type { Metadata, Viewport } from "next";
import { poppins, inter } from "@/lib/fonts";
import { defaultMetadata, defaultViewport } from "@/lib/metadata";
import { MainLayout } from "@/components/layout/MainLayout";
import { AppProviders } from "@/design-system";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
} from "@/lib/seo/structured-data";
import { clientEnv } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = defaultViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiOrigin = (() => {
    try {
      return new URL(clientEnv.apiUrl).origin;
    } catch {
      return null;
    }
  })();

  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {apiOrigin && <link rel="dns-prefetch" href={apiOrigin} />}
        <meta name="application-name" content="Le Maia" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-body antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <AppProviders>
          <MainLayout>{children}</MainLayout>
        </AppProviders>
      </body>
    </html>
  );
}
