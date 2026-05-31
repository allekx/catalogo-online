"use client";

import { useEffect, useState } from "react";
import { CATALOG_CATEGORIES } from "@/lib/catalog/constants";
import { normalizeCatalogSlug } from "@/lib/catalog/slug";
import { api } from "@/services/api";
import type { ApiCategoryPayload } from "@/lib/products/api-types";

export type CatalogCategoryOption = {
  slug: string;
  name: string;
  id?: string;
  imageUrl?: string | null;
};

function mapApiCategories(rows: ApiCategoryPayload[]): CatalogCategoryOption[] {
  return rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    imageUrl: c.imageUrl ?? null,
  }));
}

/** Categorias do banco; fallback estático só se a API falhar */
export function useCatalogCategories() {
  const [categories, setCategories] = useState<CatalogCategoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api.categories
      .list()
      .then((rows) => {
        if (cancelled) return;
        if (Array.isArray(rows) && rows.length > 0) {
          setCategories(mapApiCategories(rows));
        } else {
          setCategories([]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([...CATALOG_CATEGORIES]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const findBySlug = (slug: string | null) => {
    if (!slug) return undefined;
    const want = normalizeCatalogSlug(slug);
    return categories.find(
      (c) => c.slug === slug || normalizeCatalogSlug(c.slug) === want
    );
  };

  return { categories, loading, findBySlug };
}
