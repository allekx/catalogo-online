import path from "node:path";
import { fileURLToPath } from "node:url";
import withPWA from "@ducanh2912/next-pwa";

const isDev = process.env.NODE_ENV === "development";
const projectDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve.alias["@"] = projectDir;
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 390, 414, 428, 640, 750, 828, 1080, 1200],
    imageSizes: [128, 192, 256, 384, 480],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
  async redirects() {
    return [
      { source: "/perfil", destination: "/catalogo", permanent: true },
      { source: "/perfil/:path*", destination: "/catalogo", permanent: true },
      { source: "/pedidos", destination: "/catalogo", permanent: true },
      { source: "/pedidos/:path*", destination: "/catalogo", permanent: true },
      { source: "/login", destination: "/catalogo", permanent: false },
      { source: "/cadastro", destination: "/catalogo", permanent: true },
      { source: "/checkout", destination: "/carrinho", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

/** PWA só em produção — evita webpack/SW interferindo no dev */
const config = isDev
  ? nextConfig
  : withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
      cacheOnFrontEndNav: false,
      aggressiveFrontEndNavCaching: false,
      reloadOnOnline: true,
      fallbacks: {
        document: "/offline",
      },
      workboxOptions: {
        disableDevLogs: true,
        /** Sem fallback em navegação — evita mostrar /offline com o site online */
        navigateFallback: null,
        navigateFallbackDenylist: [
          /^\/api/,
          /^\/_next/,
          /^\/admin/,
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cloudinary-images",
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /\/_next\/image\?url=.+/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "next-image",
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
          {
            urlPattern: /\/api\//i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 8,
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 60 * 5,
              },
            },
          },
        ],
      },
    })(nextConfig);

export default config;
