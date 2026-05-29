function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${key}`);
  }
  return value;
}

function optional(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

const isProduction = process.env.NODE_ENV === "production";

const INSECURE_ADMIN_KEY = "dev-admin-key";
const INSECURE_ADMIN_PASSWORD = "lemaia2024";
const INSECURE_UPLOAD_KEY = "dev-upload-key-change-in-production";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction,
  isDevelopment: !isProduction,
  port: parseInt(process.env.PORT ?? "4000", 10),
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  databaseUrl: optional("DATABASE_URL"),
  directUrl: optional("DIRECT_URL"),
  cloudinary: {
    cloudName: optional("CLOUDINARY_CLOUD_NAME"),
    apiKey: optional("CLOUDINARY_API_KEY"),
    apiSecret: optional("CLOUDINARY_API_SECRET"),
    folder: optional("CLOUDINARY_FOLDER", "le-maia"),
  },
  uploadApiKey: optional("UPLOAD_API_KEY"),
  adminApiKey: optional("ADMIN_API_KEY", INSECURE_ADMIN_KEY),
  adminPassword: optional("ADMIN_PASSWORD", INSECURE_ADMIN_PASSWORD),
} as const;

export function assertProductionEnv(): void {
  if (!env.isProduction) return;

  required("DATABASE_URL");
  required("DIRECT_URL");
  required("CORS_ORIGIN");

  if (!env.uploadApiKey || env.uploadApiKey === INSECURE_UPLOAD_KEY) {
    throw new Error(
      "UPLOAD_API_KEY deve ser definida com valor seguro em produção"
    );
  }

  if (!env.adminApiKey || env.adminApiKey === INSECURE_ADMIN_KEY) {
    throw new Error(
      "ADMIN_API_KEY deve ser definida com valor seguro em produção"
    );
  }

  if (!env.adminPassword || env.adminPassword === INSECURE_ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_PASSWORD deve ser alterada em produção"
    );
  }

  const hasInsecureCors = env.corsOrigins.some(
    (o) => o.startsWith("http://") && !o.includes("localhost")
  );
  if (hasInsecureCors) {
    console.warn(
      "[env] CORS_ORIGIN contém HTTP não-local — prefira HTTPS em produção"
    );
  }
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    env.cloudinary.cloudName &&
      env.cloudinary.apiKey &&
      env.cloudinary.apiSecret
  );
}
