import type { NextRequest } from "next/server";
import { prisma } from "../prisma";
import {
  catalogProductWhere,
  notDeleted,
  productWithImagesInclude,
} from "../db";
import { serializeProduct } from "../serializers/product";
import { apiError, json } from "../http";

export async function listFavorites(request: NextRequest) {
  try {
    const guestKey = request.nextUrl.searchParams.get("guestKey") ?? undefined;
    const customerId =
      request.nextUrl.searchParams.get("customerId") ?? undefined;

    if (!guestKey && !customerId) {
      return apiError("guestKey ou customerId obrigatório", 400);
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

    return json({
      items: favorites.map((f) => ({
        id: f.id,
        productId: f.productId,
        createdAt: f.createdAt.toISOString(),
        product: serializeProduct(f.product),
      })),
    });
  } catch (error) {
    console.error("[api/favorites]", error);
    return apiError("Erro ao listar favoritos", 500);
  }
}

export async function createFavorite(request: NextRequest) {
  try {
    const { productId, guestKey, customerId } = (await request.json()) as {
      productId?: string;
      guestKey?: string;
      customerId?: string;
    };

    if (!productId || (!guestKey && !customerId)) {
      return apiError("productId e guestKey ou customerId obrigatórios", 400);
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, ...catalogProductWhere },
    });
    if (!product) return apiError("Produto não encontrado", 404);

    const existing = await prisma.favorite.findFirst({
      where: {
        productId,
        ...notDeleted,
        ...(customerId ? { customerId } : { guestKey }),
      },
    });

    if (existing) return json({ id: existing.id, created: false });

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
      return json({ id: restored.id, created: false, restored: true });
    }

    const favorite = await prisma.favorite.create({
      data: {
        productId,
        customerId: customerId ?? null,
        guestKey: customerId ? null : guestKey,
      },
    });

    return json({ id: favorite.id, created: true }, 201);
  } catch (error) {
    console.error("[api/favorites create]", error);
    return apiError("Erro ao favoritar", 500);
  }
}

export async function deleteFavorite(request: NextRequest) {
  try {
    const { productId, guestKey, customerId } = (await request.json()) as {
      productId?: string;
      guestKey?: string;
      customerId?: string;
    };

    if (!productId || (!guestKey && !customerId)) {
      return apiError("productId e guestKey ou customerId obrigatórios", 400);
    }

    const result = await prisma.favorite.updateMany({
      where: {
        productId,
        ...notDeleted,
        ...(customerId ? { customerId } : { guestKey }),
      },
      data: { deletedAt: new Date() },
    });

    return json({ success: true, count: result.count });
  } catch (error) {
    console.error("[api/favorites delete]", error);
    return apiError("Erro ao remover favorito", 500);
  }
}
