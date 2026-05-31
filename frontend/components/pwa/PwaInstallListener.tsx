"use client";

import { useEffect } from "react";
import {
  usePwaInstallStore,
  type BeforeInstallPromptEvent,
} from "@/store/usePwaInstallStore";

/** Registra o evento de instalação PWA (Android/Chrome) para o banner e o menu */
export function PwaInstallListener() {
  const setDeferred = usePwaInstallStore((s) => s.setDeferred);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [setDeferred]);

  return null;
}
