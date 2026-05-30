"use client";

import Link from "next/link";
import { Typography } from "@/design-system";
import { MotionPress, StaggerReveal, StaggerItem } from "@/design-system/motion";
import { HOME_CATEGORIES } from "@/lib/data/home";
import { ROUTES } from "@/lib/constants/routes";

export default function CategoriesPage() {
  return (
    <div>
      <Typography variant="display-sm" className="mb-1">
        Categorias
      </Typography>
      <Typography variant="body-sm" className="mb-6 text-maia-muted">
        Explore por tipo de produto
      </Typography>

      <StaggerReveal stagger={0.05} className="grid grid-cols-2 gap-3">
        {HOME_CATEGORIES.map((cat) => (
          <StaggerItem key={cat.slug}>
            <MotionPress hover className="h-full">
              <Link
                href={`${ROUTES.catalog}?categoria=${cat.slug}`}
                className="flex h-full flex-col items-center gap-3 rounded-3xl bg-white p-6 shadow-card"
              >
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.icon}
                </span>
                <span className="font-display text-sm font-semibold text-maia-text">
                  {cat.name}
                </span>
              </Link>
            </MotionPress>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </div>
  );
}
