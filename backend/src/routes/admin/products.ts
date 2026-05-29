import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { archiveSlug, notDeleted, productWithImagesInclude } from "../../lib/db";
import { syncProductImages } from "../../lib/product-images";
import { serializeAdminProduct } from "../../lib/serializers/product";
import { slugify, uniqueProductSlug } from "../../lib/slug";

export const adminProductsRouter = Router();

async function slugExists(slug: string, excludeId?: string) {
  const found = await prisma.product.findFirst({
    where: {
      slug,
      ...notDeleted,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });
  return Boolean(found);
}

adminProductsRouter.get("/", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: notDeleted,
      include: productWithImagesInclude,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    res.json(products.map(serializeAdminProduct));
  } catch (error) {
    console.error("[admin/products]", error);
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
});

adminProductsRouter.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, ...notDeleted },
      include: productWithImagesInclude,
    });
    if (!product) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }
    res.json(serializeAdminProduct(product));
  } catch (error) {
    console.error("[admin/product]", error);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

adminProductsRouter.post("/", async (req, res) => {
  try {
    const body = req.body as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    if (!name) {
      res.status(400).json({ error: "Nome obrigatório" });
      return;
    }

    const categoryId = String(body.categoryId ?? "");
    const category = await prisma.category.findFirst({
      where: { id: categoryId, ...notDeleted },
    });
    if (!category) {
      res.status(400).json({ error: "Categoria inválida" });
      return;
    }

    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? slugify(body.slug)
        : await uniqueProductSlug(name, slugExists);

    const imageUrls = Array.isArray(body.images)
      ? (body.images as string[]).filter(Boolean)
      : [];
    const imageUrl =
      String(body.imageUrl ?? "") || imageUrls[0] || "";

    if (!imageUrl) {
      res.status(400).json({ error: "Imagem principal obrigatória" });
      return;
    }

    const urls = imageUrls.length ? imageUrls : [imageUrl];

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: String(body.description ?? ""),
        price: Number(body.price ?? 0),
        imageUrl: urls[0],
        cloudinaryPublicId:
          typeof body.cloudinaryPublicId === "string"
            ? body.cloudinaryPublicId
            : null,
        featured: Boolean(body.featured),
        isNew: Boolean(body.isNew),
        productType:
          typeof body.productType === "string" ? body.productType : null,
        active: body.active !== false,
        stock: Number(body.stock ?? 0),
        categoryId,
        images: {
          create: urls.map((url, index) => ({
            url,
            cloudinaryPublicId:
              index === 0 && typeof body.cloudinaryPublicId === "string"
                ? body.cloudinaryPublicId
                : null,
            sortOrder: index,
            isPrimary: index === 0,
          })),
        },
      },
      include: productWithImagesInclude,
    });

    res.status(201).json(serializeAdminProduct(product));
  } catch (error) {
    console.error("[admin/products create]", error);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

adminProductsRouter.patch("/:id", async (req, res) => {
  try {
    const body = req.body as Record<string, unknown>;
    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, ...notDeleted },
    });
    if (!existing) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    let slug = existing.slug;
    if (typeof body.slug === "string" && body.slug.trim()) {
      slug = slugify(body.slug);
    } else if (typeof body.name === "string" && body.name !== existing.name) {
      slug = await uniqueProductSlug(body.name, (s) =>
        slugExists(s, existing.id)
      );
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(typeof body.name === "string" ? { name: body.name.trim() } : {}),
        slug,
        ...(typeof body.description === "string"
          ? { description: body.description }
          : {}),
        ...(body.price != null ? { price: Number(body.price) } : {}),
        ...(body.featured !== undefined
          ? { featured: Boolean(body.featured) }
          : {}),
        ...(body.isNew !== undefined ? { isNew: Boolean(body.isNew) } : {}),
        ...(body.productType !== undefined
          ? {
              productType:
                typeof body.productType === "string"
                  ? body.productType
                  : null,
            }
          : {}),
        ...(body.active !== undefined ? { active: Boolean(body.active) } : {}),
        ...(body.stock != null ? { stock: Number(body.stock) } : {}),
        ...(typeof body.categoryId === "string"
          ? { categoryId: body.categoryId }
          : {}),
      },
      include: productWithImagesInclude,
    });

    if (Array.isArray(body.images) && body.images.length) {
      await syncProductImages(
        product.id,
        body.images as string[],
        body.cloudinaryPublicId
          ? [String(body.cloudinaryPublicId)]
          : undefined
      );
    } else if (typeof body.imageUrl === "string" && body.imageUrl) {
      await syncProductImages(product.id, [body.imageUrl]);
    }

    const refreshed = await prisma.product.findUniqueOrThrow({
      where: { id: product.id },
      include: productWithImagesInclude,
    });

    res.json(serializeAdminProduct(refreshed));
  } catch (error) {
    console.error("[admin/products update]", error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

adminProductsRouter.delete("/:id", async (req, res) => {
  try {
    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, ...notDeleted },
    });
    if (!existing) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    await prisma.$transaction([
      prisma.productImage.updateMany({
        where: { productId: req.params.id, ...notDeleted },
        data: { deletedAt: new Date() },
      }),
      prisma.favorite.updateMany({
        where: { productId: req.params.id, ...notDeleted },
        data: { deletedAt: new Date() },
      }),
      prisma.product.update({
        where: { id: req.params.id },
        data: {
          deletedAt: new Date(),
          active: false,
          slug: archiveSlug(existing.slug, existing.id),
        },
      }),
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error("[admin/products delete]", error);
    res.status(500).json({ error: "Erro ao excluir produto" });
  }
});
