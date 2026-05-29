import { v2 as cloudinary } from "cloudinary";
import { env, isCloudinaryConfigured } from "../config/env";

export function initCloudinary(): void {
  if (!isCloudinaryConfigured()) {
    console.warn("[Cloudinary] Credenciais não configuradas — upload desabilitado");
    return;
  }

  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

export { cloudinary };

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  buffer: Buffer,
  options: { folder?: string; publicId?: string } = {}
): Promise<UploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary não configurado");
  }

  const folder = options.folder ?? env.cloudinary.folder;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" },
          { width: 1200, crop: "limit" },
        ],
        public_id: options.publicId,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload falhou"));
          return;
        }
        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!isCloudinaryConfigured()) return;
  await cloudinary.uploader.destroy(publicId);
}
