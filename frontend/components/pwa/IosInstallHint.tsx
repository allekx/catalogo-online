"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Share } from "lucide-react";
import { PWA_CONFIG, PWA_STORAGE_KEYS } from "@/lib/pwa/config";

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone;
  return isIos && !isStandalone && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

/** Dica para instalar no iOS (Safari não dispara beforeinstallprompt) */
export function IosInstallHint() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (!isIosSafari()) return;
    if (localStorage.getItem(PWA_STORAGE_KEYS.installDismissed)) return;
    const t = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(t);
  }, [pathname]);

  if (pathname.startsWith("/admin") || !show) return null;

  return (
    <div
      className="fixed left-4 right-4 z-[89] mx-auto max-w-app rounded-2xl border border-maia-rose/50 bg-white/95 px-4 py-3 shadow-card backdrop-blur-xl sm:right-6 sm:max-w-xs"
      style={{ bottom: "calc(var(--floating-bottom) + 4.5rem)" }}
    >
      <p className="font-display text-xs font-semibold text-maia-text">
        Instalar {PWA_CONFIG.shortName} no iPhone
      </p>
      <p className="mt-1 flex items-center gap-1.5 font-body text-[11px] text-maia-muted">
        <Share className="h-3.5 w-3.5 shrink-0 text-maia-orange" />
        Toque em Compartilhar → Adicionar à Tela de Início
      </p>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(PWA_STORAGE_KEYS.installDismissed, "1");
          setShow(false);
        }}
        className="mt-2 font-display text-[11px] font-medium text-maia-orange"
      >
        Entendi
      </button>
    </div>
  );
}
