import Link from "next/link";
import { Button, Typography } from "@/design-system";
import { ROUTES } from "@/lib/constants/routes";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="text-5xl">👜</span>
      <Typography variant="display-sm" className="mt-4">
        Produto não encontrado
      </Typography>
      <Typography variant="body-sm" className="mt-2 text-maia-muted">
        Este item pode ter sido removido do catálogo.
      </Typography>
      <Link href={ROUTES.catalog} className="mt-8">
        <Button variant="primary">Ver catálogo</Button>
      </Link>
    </div>
  );
}
