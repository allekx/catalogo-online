"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PWA_CONFIG, PWA_STORAGE_KEYS } from "@/lib/pwa/config";

function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** Splash ao abrir o app instalado — sensação nativa */
export function AppSplash() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isStandalonePwa()) return;
    if (sessionStorage.getItem(PWA_STORAGE_KEYS.splashSeen)) return;

    setVisible(true);
    sessionStorage.setItem(PWA_STORAGE_KEYS.splashSeen, "1");

    const delay = reduced ? 0 : 900;
    const t = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.35 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#FFF8F5]"
          role="presentation"
          aria-hidden
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white shadow-lg ring-1 ring-maia-text/[0.04]">
              <span className="font-display text-3xl font-bold text-maia-text">
                LM
              </span>
            </div>
            <p className="mt-6 font-display text-xl font-bold text-maia-text">
              {PWA_CONFIG.shortName}
            </p>
            <p className="mt-1 font-body text-sm text-maia-muted">
              Bolsas personalizadas
            </p>
          </motion.div>
          <div
            className="absolute bottom-0 left-0 right-0 h-1 bg-maia-orange/20"
            aria-hidden
          >
            <motion.div
              className="h-full bg-maia-orange"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.85, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
