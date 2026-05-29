import { Router } from "express";
import { uploadMiddleware } from "../middleware/upload";
import { requireUploadApiKey } from "../middleware/security";
import { uploadImage, deleteImage } from "../lib/cloudinary";
import { isCloudinaryConfigured } from "../config/env";

export const uploadRouter = Router();

uploadRouter.post(
  "/",
  requireUploadApiKey,
  uploadMiddleware.single("file"),
  async (req, res) => {
    if (!isCloudinaryConfigured()) {
      res.status(503).json({ error: "Cloudinary não configurado" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "Arquivo obrigatório (campo: file)" });
      return;
    }

    try {
      const folder =
        (req.body.folder as string | undefined) ?? undefined;

      const result = await uploadImage(req.file.buffer, { folder });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("[upload]", error);
      res.status(500).json({ error: "Falha no upload da imagem" });
    }
  }
);

uploadRouter.delete(
  "/:publicId",
  requireUploadApiKey,
  async (req, res) => {
    try {
      const publicId = decodeURIComponent(req.params.publicId);
      await deleteImage(publicId);
      res.json({ success: true });
    } catch (error) {
      console.error("[delete-image]", error);
      res.status(500).json({ error: "Falha ao remover imagem" });
    }
  }
);
