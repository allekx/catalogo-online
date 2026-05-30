#!/usr/bin/env node
/**
 * Valida variáveis obrigatórias antes do deploy Vercel.
 * Uso: node scripts/deploy/check-env.mjs
 */

const vars = [
  "NEXT_PUBLIC_SITE_URL",
  "DATABASE_URL",
  "DIRECT_URL",
  "ADMIN_API_KEY",
  "ADMIN_PASSWORD",
  "UPLOAD_API_KEY",
];

const recommended = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
];

let failed = false;

console.log("Le Maia — verificação de ambiente (Vercel)\n");

for (const key of vars) {
  const value = process.env[key];
  if (!value?.trim()) {
    console.error(`✗ ${key} — ausente`);
    failed = true;
  } else {
    console.log(`✓ ${key}`);
  }
}

for (const key of recommended) {
  if (!process.env[key]?.trim()) {
    console.warn(`⚠ ${key} — recomendado`);
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (siteUrl) {
  let parsed;
  try {
    const normalized = /^https?:\/\//i.test(siteUrl)
      ? siteUrl
      : `https://${siteUrl}`;
    parsed = new URL(normalized);
  } catch {
    console.error(
      "✗ NEXT_PUBLIC_SITE_URL — URL inválida (causa 500 no Vercel: metadataBase)"
    );
    failed = true;
    parsed = null;
  }

  if (parsed) {
    if (parsed.protocol !== "https:") {
      console.warn(
        "⚠ NEXT_PUBLIC_SITE_URL — use HTTPS em produção (ex.: https://catalogo-online.vercel.app)"
      );
    }
    if (siteUrl !== parsed.href.replace(/\/$/, "") && !/^https?:\/\//i.test(siteUrl)) {
      console.warn(
        `⚠ NEXT_PUBLIC_SITE_URL — sem protocolo; o app usará: ${parsed.origin}`
      );
    }
  }
}

if (process.env.ADMIN_API_KEY === "dev-admin-key") {
  console.warn("⚠ ADMIN_API_KEY — altere em produção");
}

if (failed) {
  process.exit(1);
}

console.log("\nOK — variáveis principais presentes.");
