import { getApiBaseUrl } from "./api-base";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const cloudinaryCloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export const clientEnv = {
  siteUrl,
  apiUrl: getApiBaseUrl(),
  cloudinaryCloudName,
  isCloudinaryEnabled: Boolean(cloudinaryCloudName),
} as const;
