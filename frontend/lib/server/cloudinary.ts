import { v2 as cloudinary } from "cloudinary";
import { isCloudinaryConfigured, serverEnv } from "./env";

let configured = false;

function ensureCloudinary(): void {
  if (configured || !isCloudinaryConfigured()) return;
  cloudinary.config({
    cloud_name: serverEnv.cloudinary.cloudName,
    api_key: serverEnv.cloudinary.apiKey,
    api_secret: serverEnv.cloudinary.apiSecret,
    secure: true,
  });
  configured = true;
}

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
  ensureCloudinary();

  const folder = options.folder ?? serverEnv.cloudinary.folder;

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
  ensureCloudinary();
  await cloudinary.uploader.destroy(publicId);
}
