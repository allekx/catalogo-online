const isProduction = process.env.NODE_ENV === "production";

const INSECURE_ADMIN_KEY = "dev-admin-key";
const INSECURE_ADMIN_PASSWORD = "lemaia2024";
function optional(key: string, fallback = ""): string {
  return process.env[key] ?? fallback;
}

export const serverEnv = {
  isProduction,
  isDevelopment: !isProduction,
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

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    serverEnv.cloudinary.cloudName &&
      serverEnv.cloudinary.apiKey &&
      serverEnv.cloudinary.apiSecret
  );
}
