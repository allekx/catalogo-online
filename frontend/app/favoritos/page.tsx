"use client";

import { FavoritesView } from "@/components/favorites/FavoritesView";
import { Typography } from "@/design-system";
import { useFavoriteCount } from "@/store/useFavoritesStore";

export default function FavoritesPage() {
  const count = useFavoriteCount();

  return (
    <div className="pb-4">
      <Typography variant="display-sm" className="mb-1">
        Favoritos
      </Typography>
      <Typography variant="body-sm" className="mb-6 text-maia-muted">
        {count > 0
          ? count === 1
            ? "Sua peça favorita, sempre à mão"
            : "Suas peças favoritas, sempre à mão"
          : "Suas peças favoritas aparecem aqui"}
      </Typography>
      <FavoritesView />
    </div>
  );
}
