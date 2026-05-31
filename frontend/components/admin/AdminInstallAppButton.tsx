"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { InstallAppHintDialog } from "@/components/pwa/InstallAppHintDialog";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import type { PwaInstallResult } from "@/hooks/usePwaInstall";
import { ADMIN_PWA_CONFIG } from "@/lib/pwa/admin-config";

export function AdminInstallAppButton() {
  const { requestInstall } = usePwaInstall({ variant: "admin" });
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<{
    open: boolean;
    variant: Extract<
      PwaInstallResult,
      "ios-instructions" | "manual-instructions" | "already-installed"
    >;
  }>({ open: false, variant: "manual-instructions" });

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await requestInstall();
      if (
        result === "ios-instructions" ||
        result === "manual-instructions" ||
        result === "already-installed"
      ) {
        setHint({ open: true, variant: result });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-6 border-t border-black/[0.06] pt-6">
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-maia-orange/25 bg-maia-orange/5 px-4 py-3 font-display text-sm font-semibold text-maia-orange transition hover:bg-maia-orange/10 active:scale-[0.99] disabled:opacity-60"
        >
          <Download className="h-4 w-4 shrink-0" />
          {loading ? "Abrindo…" : "Baixar app do painel"}
        </button>
        <p className="mt-2 text-center font-body text-[11px] leading-relaxed text-maia-muted">
          Atalho na tela inicial — abre direto o admin {ADMIN_PWA_CONFIG.shortName}.
        </p>
      </div>

      <InstallAppHintDialog
        open={hint.open}
        variant={hint.variant}
        appName={ADMIN_PWA_CONFIG.shortName}
        onClose={() => setHint((s) => ({ ...s, open: false }))}
      />
    </>
  );
}
