"use client";

import { FavoritesEmptyState } from "@/components/favorites/FavoritesEmptyState";

export default function FavoritesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <FavoritesEmptyState
      showRetry
      onRetry={() => {
        reset();
      }}
    />
  );
}
