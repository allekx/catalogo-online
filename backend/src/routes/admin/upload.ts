import { Router } from "express";
import { uploadMiddleware } from "../../middleware/upload";
import { uploadImage } from "../../lib/cloudinary";
import { isCloudinaryConfigured } from "../../config/env";

export const adminUploadRouter = Router();

adminUploadRouter.post(
  "/multiple",
  uploadMiddleware.array("files", 12),
  async (req, res) => {
    if (!isCloudinaryConfigured()) {
      res.status(503).json({ error: "Cloudinary não configurado" });
      return;
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) {
      res.status(400).json({ error: "Envie ao menos um arquivo (campo: files)" });
      return;
    }

    try {
      const folder =
        (req.body.folder as string | undefined) ?? "le-maia/products";
      const results = await Promise.all(
        files.map((file) => uploadImage(file.buffer, { folder }))
      );
      res.status(201).json({
        success: true,
        data: results.map((r) => ({
          url: r.secureUrl ?? r.url,
          secureUrl: r.secureUrl,
          publicId: r.publicId,
          width: r.width,
          height: r.height,
        })),
      });
    } catch (error) {
      console.error("[admin/upload multiple]", error);
      res.status(500).json({ error: "Falha no upload" });
    }
  }
);
