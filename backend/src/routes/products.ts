import { Router } from "express";
import { prisma } from "../lib/prisma";
import { catalogProductWhere, notDeleted, productWithImagesInclude } from "../lib/db";
import { serializeProduct } from "../lib/serializers/product";
import { cachePublicGet } from "../middleware/cacheHeaders";

export const productsRouter = Router();

productsRouter.get("/", cachePublicGet(120, 600), async (req, res) => {
  try {
    const { categoria, busca, destaque } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...catalogProductWhere,
        ...(categoria && typeof categoria === "string"
          ? { category: { slug: categoria, ...notDeleted } }
          : {}),
        ...(destaque === "true" ? { featured: true } : {}),
        ...(busca && typeof busca === "string"
          ? {
              OR: [
                { name: { contains: busca, mode: "insensitive" } },
                { description: { contains: busca, mode: "insensitive" } },
                { productType: { contains: busca, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: productWithImagesInclude,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    res.json(products.map(serializeProduct));
  } catch (error) {
    console.error("[products]", error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

productsRouter.get("/:slug/related", cachePublicGet(120, 600), async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 4, 8);
    const current = await prisma.product.findFirst({
      where: { slug: req.params.slug, ...catalogProductWhere },
    });

    if (!current) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    const related = await prisma.product.findMany({
      where: {
        ...catalogProductWhere,
        categoryId: current.categoryId,
        id: { not: current.id },
      },
      take: limit,
      include: productWithImagesInclude,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    res.json(related.map(serializeProduct));
  } catch (error) {
    console.error("[products/related]", error);
    res.status(500).json({ error: "Erro ao buscar relacionados" });
  }
});

productsRouter.post("/:slug/whatsapp-click", async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: req.params.slug, ...catalogProductWhere },
    });
    if (!product) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }
    await prisma.product.update({
      where: { id: product.id },
      data: { whatsappClicks: { increment: 1 } },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("[whatsapp-click]", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

productsRouter.get("/:slug", cachePublicGet(60, 300), async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: req.params.slug, ...catalogProductWhere },
      include: productWithImagesInclude,
    });

    if (!product) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json(serializeProduct(product));
  } catch (error) {
    console.error("[product]", error);
    res.status(500).json({ error: "Erro interno" });
  }
});
