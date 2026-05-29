import { Router } from "express";
import { prisma } from "../lib/prisma";
import { catalogProductWhere, notDeleted, productWithImagesInclude } from "../lib/db";
import { serializeProduct } from "../lib/serializers/product";

export const favoritesRouter = Router();

/** Lista favoritos por guestKey ou customerId */
favoritesRouter.get("/", async (req, res) => {
  try {
    const guestKey =
      typeof req.query.guestKey === "string" ? req.query.guestKey : undefined;
    const customerId =
      typeof req.query.customerId === "string"
        ? req.query.customerId
        : undefined;

    if (!guestKey && !customerId) {
      res.status(400).json({ error: "guestKey ou customerId obrigatório" });
      return;
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        ...notDeleted,
        ...(customerId ? { customerId } : { guestKey }),
        product: catalogProductWhere,
      },
      include: {
        product: { include: productWithImagesInclude },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      items: favorites.map((f) => ({
        id: f.id,
        productId: f.productId,
        createdAt: f.createdAt.toISOString(),
        product: serializeProduct(f.product),
      })),
    });
  } catch (error) {
    console.error("[favorites]", error);
    res.status(500).json({ error: "Erro ao listar favoritos" });
  }
});

/** Adiciona favorito (idempotente) */
favoritesRouter.post("/", async (req, res) => {
  try {
    const { productId, guestKey, customerId } = req.body as {
      productId?: string;
      guestKey?: string;
      customerId?: string;
    };

    if (!productId || (!guestKey && !customerId)) {
      res.status(400).json({ error: "productId e guestKey ou customerId obrigatórios" });
      return;
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, ...catalogProductWhere },
    });
    if (!product) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    const existing = await prisma.favorite.findFirst({
      where: {
        productId,
        ...notDeleted,
        ...(customerId ? { customerId } : { guestKey }),
      },
    });

    if (existing) {
      res.json({ id: existing.id, created: false });
      return;
    }

    const removed = await prisma.favorite.findFirst({
      where: {
        productId,
        deletedAt: { not: null },
        ...(customerId ? { customerId } : { guestKey }),
      },
    });

    if (removed) {
      const restored = await prisma.favorite.update({
        where: { id: removed.id },
        data: { deletedAt: null },
      });
      res.status(200).json({ id: restored.id, created: false, restored: true });
      return;
    }

    const favorite = await prisma.favorite.create({
      data: {
        productId,
        customerId: customerId ?? null,
        guestKey: customerId ? null : guestKey,
      },
    });

    res.status(201).json({ id: favorite.id, created: true });
  } catch (error) {
    console.error("[favorites create]", error);
    res.status(500).json({ error: "Erro ao favoritar" });
  }
});

/** Remove favorito (soft delete) */
favoritesRouter.delete("/", async (req, res) => {
  try {
    const { productId, guestKey, customerId } = req.body as {
      productId?: string;
      guestKey?: string;
      customerId?: string;
    };

    if (!productId || (!guestKey && !customerId)) {
      res.status(400).json({ error: "productId e guestKey ou customerId obrigatórios" });
      return;
    }

    const result = await prisma.favorite.updateMany({
      where: {
        productId,
        ...notDeleted,
        ...(customerId ? { customerId } : { guestKey }),
      },
      data: { deletedAt: new Date() },
    });

    res.json({ success: true, count: result.count });
  } catch (error) {
    console.error("[favorites delete]", error);
    res.status(500).json({ error: "Erro ao remover favorito" });
  }
});
