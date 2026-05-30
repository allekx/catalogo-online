"use client";

import { useEffect } from "react";
import { FavoritesEmptyState } from "@/components/favorites/FavoritesEmptyState";
import { useFavoritesStore } from "@/store/useFavoritesStore";

export default function FavoritesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      useFavoritesStore.getState().clearFavorites();
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("le-maia-favorites");
      }
    } catch {
      /* ignora — foco na experiência amigável */
    }
  }, []);

  return (
    <FavoritesEmptyState
      showRetry
      onRetry={() => {
        reset();
      }}
    />
  );
}
