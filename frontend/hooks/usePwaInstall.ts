"use client";

import { useCallback } from "react";
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

export function usePwaInstall() {
  const deferred = usePwaInstallStore((s) => s.deferred);
  const setDeferred = usePwaInstallStore((s) => s.setDeferred);

  const requestInstall = useCallback(async (): Promise<PwaInstallResult> => {
    if (isStandalonePwa()) return "already-installed";

    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      setDeferred(null);
      return outcome === "accepted" ? "prompted" : "unavailable";
    }

    if (isIosSafari()) return "ios-instructions";

    return "manual-instructions";
  }, [deferred, setDeferred]);

  return {
    canNativePrompt: Boolean(deferred),
    isStandalone: isStandalonePwa(),
    isIos: isIosSafari(),
    appName: PWA_CONFIG.shortName,
    requestInstall,
  };
}
