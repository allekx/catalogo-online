/** Slug normalizado para comparar categoria na URL com a do banco */
export function normalizeCatalogSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryMatchesFilter(
  productCategory: { id: string; slug: string } | undefined,
  filterValue: string | null
): boolean {
  if (!filterValue || !productCategory) return false;

  if (productCategory.id === filterValue) return true;

  return (
    normalizeCatalogSlug(productCategory.slug) ===
    normalizeCatalogSlug(filterValue)
  );
}
