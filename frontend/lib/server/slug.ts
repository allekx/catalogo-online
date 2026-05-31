export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueSlug(
  name: string,
  fallback: string,
  findSlug: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(name) || fallback;
  let slug = base;
  let n = 1;
  while (await findSlug(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export async function uniqueProductSlug(
  name: string,
  findSlug: (slug: string) => Promise<boolean>
): Promise<string> {
  return uniqueSlug(name, "produto", findSlug);
}

export async function uniqueCategorySlug(
  name: string,
  findSlug: (slug: string) => Promise<boolean>
): Promise<string> {
  return uniqueSlug(name, "categoria", findSlug);
}
