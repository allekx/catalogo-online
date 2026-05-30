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

if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.startsWith("https://")) {
  console.warn("⚠ NEXT_PUBLIC_SITE_URL — use HTTPS em produção");
}

if (process.env.ADMIN_API_KEY === "dev-admin-key") {
  console.warn("⚠ ADMIN_API_KEY — altere em produção");
}

if (failed) {
  process.exit(1);
}

console.log("\nOK — variáveis principais presentes.");
