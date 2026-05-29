export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueProductSlug(
  name: string,
  findSlug: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(name) || "produto";
  let slug = base;
  let n = 1;
  while (await findSlug(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export async function uniqueCategorySlug(
  name: string,
  findSlug: (slug: string) => Promise<boolean>
): Promise<string> {
  return uniqueProductSlug(name, findSlug);
}
