"use client";

import { useEffect, useState } from "react";
import { CATALOG_CATEGORIES } from "@/lib/catalog/constants";
import { normalizeCatalogSlug } from "@/lib/catalog/slug";
import { api } from "@/services/api";
import type { ApiCategoryPayload } from "@/lib/products/api-types";

export type CatalogCategoryOption = { slug: string; name: string; id?: string };

function mapApiCategories(rows: ApiCategoryPayload[]): CatalogCategoryOption[] {
  return rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
  }));
}

/** Categorias do banco; fallback estático se a API falhar */
export function useCatalogCategories() {
  const [categories, setCategories] = useState<CatalogCategoryOption[]>(
    [...CATALOG_CATEGORIES]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api.categories
      .list()
      .then((rows) => {
        if (cancelled || !rows?.length) return;
        setCategories(mapApiCategories(rows));
      })
      .catch(() => {
        /* mantém fallback */
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
