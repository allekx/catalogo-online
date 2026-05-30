"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { cn } from "@/lib/utils/cn";
import { easings } from "../tokens/animations";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  snapPoints?: number[];
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  const dragControls = useDragControls();
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 80 || info.velocity.y > 400) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-maia-text/40 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Fechar painel"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "bottom-sheet-title" : undefined}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={easings.softSpring}
            className={cn(
              "relative z-10 w-full max-w-app rounded-t-3xl bg-white shadow-nav safe-bottom",
              className
            )}
          >
            <div
              className="flex cursor-grab justify-center py-3 active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <span className="h-1 w-10 rounded-full bg-maia-rose" />
            </div>
            {title && (
              <h2
                id="bottom-sheet-title"
                className="px-5 pb-3 font-display text-lg font-semibold text-maia-text"
              >
                {title}
              </h2>
            )}
            <div className="max-h-[70vh] overflow-y-auto px-5 pb-6 hide-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
