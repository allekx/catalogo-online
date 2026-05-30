"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { buildGreetingMessage, openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils/cn";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();

  const handleClick = () => {
    openWhatsApp(buildGreetingMessage());
  };

  return (
    <AnimatePresence>
      <motion.button
        type="button"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleClick}
        aria-label="Falar no WhatsApp"
        className={cn(
          "fab-bottom fixed right-4 z-[45] flex h-14 w-14 touch-manipulation items-center justify-center rounded-full",
          "bg-[#25D366] text-white shadow-float",
          "ring-4 ring-white/80 transition-transform active:scale-95 hover:brightness-105",
          "lg:right-8 lg:bottom-8",
          pathname === "/carrinho" && "lg:bottom-8"
        )}
      >
        <MessageCircle className="h-7 w-7" strokeWidth={2} />
        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
      </motion.button>
    </AnimatePresence>
  );
}
