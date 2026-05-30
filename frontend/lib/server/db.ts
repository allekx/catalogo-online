import type { Prisma } from "@prisma/client";

export const notDeleted = {
  deletedAt: null,
} as const;

export const catalogProductWhere: Prisma.ProductWhereInput = {
  ...notDeleted,
  active: true,
  category: notDeleted,
};

export const productWithImagesInclude = {
  category: { select: { id: true, slug: true, name: true } },
  images: {
    where: notDeleted,
    orderBy: { sortOrder: "asc" as const },
  },
} satisfies Prisma.ProductInclude;

export function archiveSlug(slug: string, id: string): string {
  const suffix = `--archived-${id.slice(-8)}`;
  const max = 120;
  const base = slug.slice(0, max - suffix.length);
  return `${base}${suffix}`;
}
