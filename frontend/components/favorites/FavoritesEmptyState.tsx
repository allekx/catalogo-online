"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button, Card, Typography } from "@/design-system";
import { ROUTES } from "@/lib/constants/routes";

interface FavoritesEmptyStateProps {
  onRetry?: () => void;
  showRetry?: boolean;
}

export function FavoritesEmptyState({
  onRetry,
  showRetry = false,
}: FavoritesEmptyStateProps) {
  return (
    <Card
      variant="default"
      padding="lg"
      className="flex flex-col items-center text-center"
    >
      <Heart className="h-12 w-12 text-maia-rose" strokeWidth={1.25} />
      <Typography variant="body-sm" className="mt-4 font-medium text-maia-text">
        Sua seleção especial começa aqui
      </Typography>
      <Typography variant="body-sm" className="mt-2 max-w-sm text-maia-muted">
        Explore o catálogo e toque no coração nas peças que mais amou. Elas ficam
        guardadas neste aparelho — sem cadastro, no seu ritmo.
      </Typography>
      <Link href={ROUTES.catalog} className="mt-6 w-full max-w-xs">
        <Button variant="primary" fullWidth>
          Explorar catálogo
        </Button>
      </Link>
      {showRetry && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 font-display text-sm font-medium text-maia-orange underline-offset-2 hover:underline"
        >
          Atualizar página
        </button>
      )}
    </Card>
  );
}
