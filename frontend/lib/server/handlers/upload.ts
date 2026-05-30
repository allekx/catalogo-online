import type { NextRequest } from "next/server";
import { deleteImage, uploadImage } from "../cloudinary";
import { isCloudinaryConfigured } from "../env";
import { apiError, json } from "../http";
import { parseMultipleImages, parseSingleImage } from "../upload-parse";

export async function uploadSingle(request: NextRequest) {
  if (!isCloudinaryConfigured()) {
    return apiError("Cloudinary não configurado", 503);
  }

  const form = await request.formData();
  const parsed = await parseSingleImage(form);
  if ("error" in parsed) return apiError(parsed.error, parsed.status);

  try {
    const result = await uploadImage(parsed.file.buffer, {
      folder: parsed.folder,
    });
    return json({ success: true, data: result }, 201);
  } catch (error) {
    console.error("[api/upload]", error);
    return apiError("Falha no upload da imagem", 500);
  }
}

export async function deleteUploaded(publicId: string) {
  try {
    await deleteImage(decodeURIComponent(publicId));
    return json({ success: true });
  } catch (error) {
    console.error("[api/delete-image]", error);
    return apiError("Falha ao remover imagem", 500);
  }
}

export async function uploadAdminMultiple(request: NextRequest) {
  if (!isCloudinaryConfigured()) {
    return apiError("Cloudinary não configurado", 503);
  }

  const form = await request.formData();
  const parsed = await parseMultipleImages(form);
  if ("error" in parsed) return apiError(parsed.error, parsed.status);

  try {
    const folder = parsed.folder ?? "le-maia/products";
    const results = await Promise.all(
      parsed.files.map((file) => uploadImage(file.buffer, { folder }))
    );
    return json(
      {
        success: true,
        data: results.map((r) => ({
          url: r.secureUrl ?? r.url,
          secureUrl: r.secureUrl,
          publicId: r.publicId,
          width: r.width,
          height: r.height,
        })),
      },
      201
    );
  } catch (error) {
    console.error("[api/admin/upload]", error);
    return apiError("Falha no upload", 500);
  }
}
