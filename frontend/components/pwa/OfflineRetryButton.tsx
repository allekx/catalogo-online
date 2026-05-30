"use client";

import { Button } from "@/design-system";

export function OfflineRetryButton() {
  return (
    <Button variant="primary" onClick={() => window.location.reload()}>
      Tentar novamente
    </Button>
  );
}
