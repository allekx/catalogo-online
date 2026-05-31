"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/design-system";
import { PWA_CONFIG, PWA_STORAGE_KEYS } from "@/lib/pwa/config";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { usePwaInstallStore } from "@/store/usePwaInstallStore";

export function InstallPrompt() {
  const deferred = usePwaInstallStore((s) => s.deferred);
  const { requestInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(true);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(PWA_STORAGE_KEYS.installDismissed)) {
      setDismissed(true);
      return;
    }
    if (deferred) setDismissed(false);
  }, [deferred]);

  const dismiss = useCallback(() => {
    localStorage.setItem(PWA_STORAGE_KEYS.installDismissed, "1");
    setDismissed(true);
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    setInstalling(true);
    try {
      const result = await requestInstall();
      if (result === "prompted") dismiss();
      else setDismissed(false);
    } finally {
      setInstalling(false);
    }
  }, [deferred, dismiss, requestInstall]);

  if (dismissed || !deferred) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="fixed left-4 right-4 z-[90] mx-auto max-w-app sm:left-auto sm:right-6 sm:max-w-sm"
        style={{ bottom: "calc(var(--floating-bottom) + 4.5rem)" }}
        role="dialog"
        aria-label="Instalar catálogo Le Maia na tela inicial"
      >
        <div className="flex items-start gap-3 rounded-3xl border border-maia-rose/40 bg-white/95 p-4 shadow-nav backdrop-blur-xl">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-maia-orange/10">
            <Download className="h-5 w-5 text-maia-orange" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold text-maia-text">
              Instalar {PWA_CONFIG.shortName}
            </p>
            <p className="mt-0.5 font-body text-xs text-maia-muted">
              Acesso rápido na tela inicial, como um app nativo.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="primary"
                size="sm"
                loading={installing}
                onClick={install}
              >
                Instalar
              </Button>
              <Button variant="ghost" size="sm" onClick={dismiss}>
                Agora não
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="touch-target-sm -mr-1 -mt-1 flex shrink-0 items-center justify-center rounded-full text-maia-muted hover:bg-maia-nude/50"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
