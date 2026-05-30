import type { NextRequest } from "next/server";
import { prisma } from "../prisma";
import {
  catalogProductWhere,
  notDeleted,
  productWithImagesInclude,
} from "../db";
import { serializeProduct } from "../serializers/product";
import { slugify } from "../slug";
import { apiError, cacheHeaders, json } from "../http";

export async function listProducts(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoriaRaw = searchParams.get("categoria");
    const categoria = categoriaRaw ? slugify(categoriaRaw) : null;
    const busca = searchParams.get("busca");
    const destaque = searchParams.get("destaque");

    const products = await prisma.product.findMany({
      where: {
        ...catalogProductWhere,
        ...(categoria
          ? { category: { slug: categoria, ...notDeleted } }
          : {}),
        ...(destaque === "true" ? { featured: true } : {}),
        ...(busca
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

    return json(products.map(serializeProduct), 200, cacheHeaders(120, 600));
  } catch (error) {
    console.error("[api/products]", error);
    return apiError("Erro ao buscar produtos", 500);
  }
}

export async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { slug, ...catalogProductWhere },
      include: productWithImagesInclude,
    });

    if (!product) return apiError("Produto não encontrado", 404);

    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return json(serializeProduct(product), 200, cacheHeaders(60, 300));
  } catch (error) {
    console.error("[api/product]", error);
    return apiError("Erro interno", 500);
  }
}

export async function getRelatedProducts(slug: string, request: NextRequest) {
  try {
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get("limit") ?? "4", 10) || 4,
      8
    );
    const current = await prisma.product.findFirst({
      where: { slug, ...catalogProductWhere },
    });

    if (!current) return apiError("Produto não encontrado", 404);

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

    return json(related.map(serializeProduct), 200, cacheHeaders(120, 600));
  } catch (error) {
    console.error("[api/products/related]", error);
    return apiError("Erro ao buscar relacionados", 500);
  }
}

export async function trackWhatsAppClick(slug: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { slug, ...catalogProductWhere },
    });
    if (!product) return apiError("Produto não encontrado", 404);

    await prisma.product.update({
      where: { id: product.id },
      data: { whatsappClicks: { increment: 1 } },
    });

    return json({ success: true });
  } catch (error) {
    console.error("[api/whatsapp-click]", error);
    return apiError("Erro interno", 500);
  }
}
