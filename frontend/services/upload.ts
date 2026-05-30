import { clientEnv } from "@/lib/env";

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    secureUrl: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
}

/** Upload de imagem via Route Handler Next.js → Cloudinary */
export async function uploadImage(
  file: File,
  options: { apiKey: string; folder?: string }
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (options.folder) formData.append("folder", options.folder);

  const response = await fetch(`${clientEnv.apiUrl}/upload`, {
    method: "POST",
    headers: { "x-api-key": options.apiKey },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? "Falha no upload"
    );
  }

  return response.json();
}
