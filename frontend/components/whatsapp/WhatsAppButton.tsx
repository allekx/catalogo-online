"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/design-system";
import { cn } from "@/lib/utils/cn";
import { openWhatsApp } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  message: string;
  label?: string;
  fullWidth?: boolean;
  variant?: "primary" | "whatsapp";
  className?: string;
  onAfterClick?: () => void;
}

export function WhatsAppButton({
  message,
  label = "Finalizar no WhatsApp",
  fullWidth = true,
  variant = "whatsapp",
  className,
  onAfterClick,
}: WhatsAppButtonProps) {
  const handleClick = () => {
    openWhatsApp(message);
    onAfterClick?.();
  };

  return (
    <Button
      type="button"
      variant="primary"
      fullWidth={fullWidth}
      leftIcon={<MessageCircle className="h-5 w-5" />}
      onClick={handleClick}
      className={cn(
        variant === "whatsapp" &&
          "bg-[#25D366] shadow-none hover:brightness-105 active:brightness-95",
        className
      )}
    >
      {label}
    </Button>
  );
}
