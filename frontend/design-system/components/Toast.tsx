"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useToastStore, type ToastType } from "../store/useToastStore";

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles: Record<ToastType, string> = {
  success: "border-semantic-success/30 bg-green-50 text-semantic-success",
  error: "border-semantic-error/30 bg-red-50 text-semantic-error",
  info: "border-semantic-info/30 bg-blue-50 text-semantic-info",
  warning: "border-semantic-warning/30 bg-amber-50 text-semantic-warning",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[200] flex flex-col items-center gap-2 p-4 safe-top"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={cn(
                "pointer-events-auto flex w-full max-w-app items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg",
                styles[t.type]
              )}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
              <p className="flex-1 font-body text-sm font-medium text-maia-text">
                {t.message}
              </p>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="shrink-0 rounded-lg p-1 opacity-60 hover:opacity-100"
                aria-label="Fechar notificação"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
