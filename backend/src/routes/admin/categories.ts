import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { archiveSlug, notDeleted } from "../../lib/db";
import { slugify } from "../../lib/slug";

export const adminCategoriesRouter = Router();

adminCategoriesRouter.get("/", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: notDeleted,
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: notDeleted } } } },
    });
    res.json(categories);
  } catch (error) {
    console.error("[admin/categories]", error);
    res.status(500).json({ error: "Erro ao listar categorias" });
  }
});

adminCategoriesRouter.post("/", async (req, res) => {
  try {
    const { name, slug, imageUrl, sortOrder, description } = req.body as {
      name?: string;
      slug?: string;
      imageUrl?: string;
      sortOrder?: number;
      description?: string;
    };
    if (!name?.trim()) {
      res.status(400).json({ error: "Nome obrigatório" });
      return;
    }
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug?.trim() ? slugify(slug) : slugify(name),
        imageUrl: imageUrl ?? null,
        description: description?.trim() ?? null,
        sortOrder: sortOrder ?? 0,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error("[admin/categories create]", error);
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
});

adminCategoriesRouter.patch("/:id", async (req, res) => {
  try {
    const { name, slug, imageUrl, sortOrder, description, active } = req.body as {
      name?: string;
      slug?: string;
      imageUrl?: string;
      sortOrder?: number;
      description?: string;
      active?: boolean;
    };
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(slug ? { slug: slugify(slug) } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(sortOrder != null ? { sortOrder } : {}),
        ...(active !== undefined ? { active } : {}),
      },
    });
    res.json(category);
  } catch (error) {
    console.error("[admin/categories update]", error);
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
});

adminCategoriesRouter.delete("/:id", async (req, res) => {
  try {
    const count = await prisma.product.count({
      where: { categoryId: req.params.id, ...notDeleted },
    });
    if (count > 0) {
      res.status(400).json({
        error: "Categoria possui produtos vinculados",
      });
      return;
    }

    const existing = await prisma.category.findFirst({
      where: { id: req.params.id, ...notDeleted },
    });
    if (!existing) {
      res.status(404).json({ error: "Categoria não encontrada" });
      return;
    }

    await prisma.category.update({
      where: { id: req.params.id },
      data: {
        deletedAt: new Date(),
        active: false,
        slug: archiveSlug(existing.slug, existing.id),
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("[admin/categories delete]", error);
    res.status(500).json({ error: "Erro ao excluir categoria" });
  }
});
