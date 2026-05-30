"use client";

import Link from "next/link";
import { Button } from "@/design-system";
import { ROUTES } from "@/lib/constants/routes";

export default function FavoritesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-xl font-semibold text-maia-text">
        Não foi possível abrir favoritos
      </h1>
      <p className="mt-2 max-w-sm text-sm text-maia-muted">
        Limpe os dados do site no navegador e tente de novo. Seus favoritos ficam
        salvos neste aparelho.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" onClick={() => reset()}>
          Tentar novamente
        </Button>
        <Link href={ROUTES.catalog}>
          <Button variant="secondary" fullWidth>
            Ir ao catálogo
          </Button>
        </Link>
      </div>
    </div>
  );
}
