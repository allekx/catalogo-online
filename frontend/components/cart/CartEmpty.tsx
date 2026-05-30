"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button, Typography } from "@/design-system";
import { ROUTES } from "@/lib/constants/routes";

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-maia-nude/30 px-6 py-12 text-center">
      <ShoppingBag className="h-12 w-12 text-maia-rose" strokeWidth={1.25} />
      <Typography variant="body-sm" className="mt-4 text-maia-muted">
        Seu carrinho está vazio.
      </Typography>
      <Link href={ROUTES.catalog} className="mt-6">
        <Button variant="primary">Explorar catálogo</Button>
      </Link>
    </div>
  );
}
