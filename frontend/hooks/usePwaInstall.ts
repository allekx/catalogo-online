"use client";

import { useCallback } from "react";
import { ADMIN_PWA_CONFIG } from "@/lib/pwa/admin-config";
import { PWA_CONFIG } from "@/lib/pwa/config";
import {
  isIosSafari,
  isStandalonePwa,
  usePwaInstallStore,
} from "@/store/usePwaInstallStore";

export type PwaInstallResult =
  | "prompted"
  | "already-installed"
  | "ios-instructions"
  | "manual-instructions"
  | "unavailable";

type UsePwaInstallOptions = {
  /** `admin` = app do painel (manifest /admin); padrão = catálogo */
  variant?: "catalog" | "admin";
};

function isAdminStandalone(): boolean {
  if (!isStandalonePwa() || typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/admin");
}

export function usePwaInstall(options: UsePwaInstallOptions = {}) {
  const variant = options.variant ?? "catalog";
  const deferred = usePwaInstallStore((s) => s.deferred);
  const setDeferred = usePwaInstallStore((s) => s.setDeferred);
  const appName =
    variant === "admin" ? ADMIN_PWA_CONFIG.shortName : PWA_CONFIG.shortName;

  const requestInstall = useCallback(async (): Promise<PwaInstallResult> => {
    if (variant === "admin" ? isAdminStandalone() : isStandalonePwa()) {
      return "already-installed";
    }

    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      setDeferred(null);
      return outcome === "accepted" ? "prompted" : "unavailable";
    }

    if (isIosSafari()) return "ios-instructions";

    return "manual-instructions";
  }, [deferred, setDeferred, variant]);

  return {
    canNativePrompt: Boolean(deferred),
    isStandalone:
      variant === "admin" ? isAdminStandalone() : isStandalonePwa(),
    isIos: isIosSafari(),
    appName,
    requestInstall,
  };
}
