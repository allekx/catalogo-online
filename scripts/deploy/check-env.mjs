#!/usr/bin/env node
/**
 * Valida variáveis obrigatórias antes do deploy.
 * Uso: node scripts/deploy/check-env.mjs [frontend|backend|admin|all]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const target = process.argv[2] ?? "all";

const checks = {
  frontend: {
    label: "Frontend (Vercel)",
    vars: ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_API_URL"],
    recommended: ["NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"],
    rules: [
      {
        key: "NEXT_PUBLIC_SITE_URL",
        test: (v) => v.startsWith("https://"),
        msg: "Use HTTPS em produção (NEXT_PUBLIC_SITE_URL)",
      },
      {
        key: "NEXT_PUBLIC_API_URL",
        test: (v) => v.startsWith("https://") && v.endsWith("/api"),
        msg: "API URL deve ser HTTPS e terminar com /api",
      },
    ],
  },
  backend: {
    label: "Backend (Railway)",
    vars: [
      "DATABASE_URL",
      "DIRECT_URL",
      "NODE_ENV",
      "CORS_ORIGIN",
      "UPLOAD_API_KEY",
      "ADMIN_API_KEY",
      "ADMIN_PASSWORD",
    ],
    recommended: [
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ],
    rules: [
      {
        key: "DATABASE_URL",
        test: (v) => v.includes("pgbouncer") || v.includes(":6543"),
        msg: "DATABASE_URL deve usar pooler Supabase (porta 6543 / pgbouncer)",
      },
      {
        key: "ADMIN_API_KEY",
        test: (v) => v !== "dev-admin-key",
        msg: "Altere ADMIN_API_KEY — valor padrão inseguro",
      },
      {
        key: "ADMIN_PASSWORD",
        test: (v) => v !== "lemaia2024",
        msg: "Altere ADMIN_PASSWORD — valor padrão inseguro",
      },
      {
        key: "UPLOAD_API_KEY",
        test: (v) => !v.includes("dev-upload"),
        msg: "Altere UPLOAD_API_KEY — valor padrão inseguro",
      },
    ],
  },
  admin: {
    label: "Admin (Vercel)",
    vars: ["NEXT_PUBLIC_API_URL"],
    recommended: [],
    rules: [
      {
        key: "NEXT_PUBLIC_API_URL",
        test: (v) => v.startsWith("https://") && !v.endsWith("/api"),
        msg: "URL da API sem /api no final (rotas já incluem /api/admin)",
      },
    ],
  },
};

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    for (const line of content.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* opcional */
  }
}

loadEnvFile(path.join(root, "backend", ".env"));
loadEnvFile(path.join(root, "frontend", ".env.local"));
loadEnvFile(path.join(root, "admin", ".env.local"));

const targets = target === "all" ? ["frontend", "backend", "admin"] : [target];

let failed = false;

for (const name of targets) {
  const cfg = checks[name];
  if (!cfg) {
    console.error(`Alvo desconhecido: ${name}`);
    process.exit(1);
  }

  console.log(`\n▶ ${cfg.label}`);

  for (const key of cfg.vars) {
    const val = process.env[key];
    if (!val) {
      console.error(`  ✗ ${key} — ausente`);
      failed = true;
      continue;
    }
    console.log(`  ✓ ${key}`);
    for (const rule of cfg.rules ?? []) {
      if (rule.key === key && !rule.test(val)) {
        console.warn(`    ⚠ ${rule.msg}`);
      }
    }
  }

  for (const key of cfg.recommended ?? []) {
    if (!process.env[key]) {
      console.warn(`  ○ ${key} — recomendado (opcional)`);
    }
  }
}

console.log(
  failed ? "\n❌ Falhou — corrija as variáveis.\n" : "\n✅ Variáveis obrigatórias OK.\n"
);
process.exit(failed ? 1 : 0);
