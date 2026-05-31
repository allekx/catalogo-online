"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

interface CatalogBackLinkProps {
  className?: string;
  label?: string;
}

export function CatalogBackLink({
  className,
  label = "Voltar ao catálogo",
}: CatalogBackLinkProps) {
  return (
    <Link
      href={ROUTES.catalog}
      className={cn(
        "group -ml-0.5 mb-2 inline-flex min-h-[40px] items-center gap-0.5 py-1",
        "font-display text-xs font-medium text-maia-light",
        "transition-colors duration-200 hover:text-maia-orange active:opacity-70",
        className
      )}
    >
      <ChevronLeft
        className="h-3.5 w-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
        strokeWidth={2}
        aria-hidden
      />
      <span>{label}</span>
    </Link>
  );
}
