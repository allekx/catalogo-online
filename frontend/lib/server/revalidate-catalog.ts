import { revalidatePath, revalidateTag } from "next/cache";

/** Invalida caches do catálogo após alterações no admin */
export function revalidateCatalogData(productSlug?: string) {
  revalidateTag("products");
  revalidateTag("categories");
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/categorias");
  if (productSlug) {
    revalidateTag(`product-${productSlug}`);
    revalidatePath(`/catalogo/${productSlug}`);
  }
}
