"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { ADMIN_PWA_CONFIG } from "@/lib/pwa/admin-config";

export function AdminInstallAppButton() {
  const { requestInstall, canNativePrompt, isStandalone } = usePwaInstall({
    variant: "admin",
  });
  const [loading, setLoading] = useState(false);

  if (isStandalone) {
    return (
      <p className="mt-6 border-t border-black/[0.06] pt-6 text-center font-body text-xs text-maia-muted">
        App {ADMIN_PWA_CONFIG.shortName} instalado neste dispositivo.
      </p>
    );
  }

  if (!canNativePrompt) return null;

  const handleClick = async () => {
    setLoading(true);
    try {
      await requestInstall();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border-t border-black/[0.06] pt-6">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-maia-orange/25 bg-maia-orange/5 px-4 py-3 font-display text-sm font-semibold text-maia-orange transition hover:bg-maia-orange/10 active:scale-[0.99] disabled:opacity-60"
      >
        <Download className="h-4 w-4 shrink-0" />
        {loading ? "Instalando…" : "Baixar app do painel"}
      </button>
    </div>
  );
}
