import { Router } from "express";
import { prisma } from "../lib/prisma";
import { notDeleted } from "../lib/db";
import { cachePublicGet } from "../middleware/cacheHeaders";

export const categoriesRouter = Router();

categoriesRouter.get("/", cachePublicGet(300, 1800), async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { ...notDeleted, active: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            products: { where: { active: true, ...notDeleted } },
          },
        },
      },
    });
    res.json(categories);
  } catch (error) {
    console.error("[categories]", error);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});
