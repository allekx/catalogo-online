"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/** Barra discreta quando a conexão cai (app instalado ou browser) */
export function OfflineNotice() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);

    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="fixed left-0 right-0 top-0 z-[95] flex items-center justify-center gap-2 bg-maia-text/90 px-4 py-2 text-center safe-top"
          role="status"
        >
          <WifiOff className="h-4 w-4 shrink-0 text-white" />
          <span className="font-display text-xs font-medium text-white">
            Sem internet — modo offline ativo
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
