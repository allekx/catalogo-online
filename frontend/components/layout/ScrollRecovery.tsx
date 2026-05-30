"use client";

import { useEffect } from "react";
import { releaseAllBodyScrollLocks } from "@/hooks/useBodyScrollLock";

/** Garante que a rolagem da página não fique presa após overlays ou cache PWA */
export function ScrollRecovery() {
  useEffect(() => {
    const unlock = () => {
      releaseAllBodyScrollLocks();
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.height = "";
      document.body.style.touchAction = "";
    };

    unlock();

    window.addEventListener("pageshow", unlock);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") unlock();
    });

    return () => {
      window.removeEventListener("pageshow", unlock);
    };
  }, []);

  return null;
}
