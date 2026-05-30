"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { cn } from "@/lib/utils/cn";
import { motionVariants, easings } from "../tokens/animations";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  showClose = true,
}: ModalProps) {
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-maia-text/40 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Fechar diálogo"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            initial={motionVariants.scale.initial}
            animate={motionVariants.scale.animate}
            exit={motionVariants.scale.exit}
            transition={easings.softSpring}
            className={cn(
              "relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl",
              className
            )}
          >
            {(title || showClose) && (
              <div className="mb-4 flex items-start justify-between gap-4">
                {title && (
                  <h2
                    id="modal-title"
                    className="font-display text-lg font-semibold text-maia-text"
                  >
                    {title}
                  </h2>
                )}
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-maia-muted hover:bg-maia-nude/60"
                    aria-label="Fechar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
