import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button, Typography } from "@/design-system";
import { OfflineRetryButton } from "@/components/pwa/OfflineRetryButton";
import { ROUTES } from "@/lib/constants/routes";

export const metadata = {
  title: "Sem conexão",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-maia-nude/80 shadow-card">
        <WifiOff className="h-10 w-10 text-maia-orange" strokeWidth={1.5} />
      </div>
      <Typography variant="display-sm" className="mb-2">
        Você está offline
      </Typography>
      <Typography variant="body-sm" className="mb-8 max-w-sm text-maia-muted">
        O catálogo Le Maia ainda funciona com páginas já visitadas. Conecte-se
        à internet para ver novidades e atualizar o carrinho.
      </Typography>
      <div className="flex flex-col gap-3 sm:flex-row">
        <OfflineRetryButton />
        <Link href={ROUTES.home}>
          <Button variant="secondary" fullWidth>
            Ir para início
          </Button>
        </Link>
      </div>
    </div>
  );
}
