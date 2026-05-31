import { create } from "zustand";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type PwaInstallState = {
  deferred: BeforeInstallPromptEvent | null;
  setDeferred: (event: BeforeInstallPromptEvent | null) => void;
};

export const usePwaInstallStore = create<PwaInstallState>((set) => ({
  deferred: null,
  setDeferred: (deferred) => set({ deferred }),
}));

export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  return isIos && !isStandalonePwa() && !/CriOS|FxiOS|EdgiOS/.test(ua);
}
