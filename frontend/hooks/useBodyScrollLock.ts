"use client";

import { useEffect } from "react";

let lockCount = 0;

function applyBodyScrollLock() {
  if (typeof document === "undefined") return;
  document.body.style.overflow = lockCount > 0 ? "hidden" : "";
}

/** Bloqueia rolagem do documento (modais, menus). Contador evita estado preso ao fechar vários overlays. */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    lockCount += 1;
    applyBodyScrollLock();

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      applyBodyScrollLock();
    };
  }, [active]);
}

export function releaseAllBodyScrollLocks() {
  lockCount = 0;
  applyBodyScrollLock();
}
