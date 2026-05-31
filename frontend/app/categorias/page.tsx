"use client";

import Link from "next/link";
import { Typography } from "@/design-system";
import { MotionPress } from "@/design-system/motion";
import { useCatalogCategories } from "@/hooks/useCatalogCategories";
import { ROUTES } from "@/lib/constants/routes";

export default function CategoriesPage() {
  const { categories, loading } = useCatalogCategories();

  return (
    <div>
      <Typography variant="display-sm" className="mb-1">
        Categorias
      </Typography>
      <Typography variant="body-sm" className="mb-6 text-maia-muted">
        Explore por tipo de produto
      </Typography>

      {loading ? (
        <p className="text-sm text-maia-muted">Carregando categorias…</p>
      ) : categories.length === 0 ? (
        <p className="rounded-2xl bg-maia-nude/40 px-4 py-8 text-center text-sm text-maia-muted">
          Nenhuma categoria ativa ainda.
        </p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0" role="list">
          {categories.map((cat) => (
            <li key={cat.slug} className="list-none">
              <MotionPress hover className="h-full">
                <Link
                  href={`${ROUTES.catalog}?categoria=${encodeURIComponent(cat.slug)}`}
                  className="flex h-full flex-col items-center gap-3 rounded-3xl bg-white p-6 shadow-card"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-maia-nude/80 font-display text-2xl font-bold text-maia-orange shadow-sm">
                    {cat.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-center font-display text-sm font-semibold text-maia-text">
                    {cat.name}
                  </span>
                </Link>
              </MotionPress>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
