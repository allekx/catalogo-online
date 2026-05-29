import { Prisma } from "@prisma/client";

/** Registros não excluídos (soft delete) */
export const notDeleted = {
  deletedAt: null,
} as const;

export type NotDeletedWhere = { deletedAt: null };

/** Produto ativo no catálogo público */
export const catalogProductWhere: Prisma.ProductWhereInput = {
  ...notDeleted,
  active: true,
  category: notDeleted,
};

/** Include padrão de imagens para serialização */
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
