import { prisma } from "../prisma";
import { notDeleted } from "../db";
import { apiError, cacheHeaders, json } from "../http";

export async function listCategories() {
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
    return json(categories, 200, cacheHeaders(60, 120));
  } catch (error) {
    console.error("[api/categories]", error);
    return apiError("Erro ao buscar categorias", 500);
  }
}
