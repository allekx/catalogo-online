"use client";

import { Share, Smartphone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PWA_CONFIG } from "@/lib/pwa/config";
import type { PwaInstallResult } from "@/hooks/usePwaInstall";

type InstallAppHintDialogProps = {
  open: boolean;
  variant: Extract<PwaInstallResult, "ios-instructions" | "manual-instructions" | "already-installed">;
  onClose: () => void;
};

export function InstallAppHintDialog({
  open,
  variant,
  onClose,
}: InstallAppHintDialogProps) {
  const isIos = variant === "ios-instructions";
  const isInstalled = variant === "already-installed";

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Instalar ${PWA_CONFIG.shortName}`}
        >
          <motion.button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-maia-text/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-nav"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-maia-muted hover:bg-maia-nude/50"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-maia-orange/10 text-maia-orange">
              <Smartphone className="h-5 w-5" />
            </div>

            <h2 className="mt-3 font-display text-base font-semibold text-maia-text">
              {isInstalled
                ? `${PWA_CONFIG.shortName} já está instalado`
                : `Instalar ${PWA_CONFIG.shortName}`}
            </h2>

            <p className="mt-2 font-body text-sm leading-relaxed text-maia-muted">
              {isInstalled ? (
                <>Abra pelo ícone na tela inicial do seu celular.</>
              ) : isIos ? (
                <>
                  No Safari, toque em{" "}
                  <Share className="inline h-4 w-4 align-text-bottom text-maia-orange" />{" "}
                  <strong className="font-medium text-maia-text">Compartilhar</strong>{" "}
                  e escolha{" "}
                  <strong className="font-medium text-maia-text">
                    Adicionar à Tela de Início
                  </strong>
                  .
                </>
              ) : (
                <>
                  No menu do navegador (⋮), escolha{" "}
                  <strong className="font-medium text-maia-text">
                    Instalar app
                  </strong>{" "}
                  ou{" "}
                  <strong className="font-medium text-maia-text">
                    Adicionar à tela inicial
                  </strong>
                  .
                </>
              )}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="btn-primary mt-4 w-full"
            >
              Entendi
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
