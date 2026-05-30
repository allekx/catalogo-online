"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { press, springPress } from "../motion/config";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-maia-orange text-white shadow-float hover:brightness-105 active:brightness-95",
  secondary:
    "bg-maia-nude/80 text-maia-text border border-maia-rose/50 hover:bg-maia-nude active:bg-maia-rose/30",
  ghost:
    "bg-transparent text-maia-text hover:bg-maia-nude/50 active:bg-maia-nude",
  outline:
    "bg-transparent text-maia-orange border-2 border-maia-orange hover:bg-maia-orange/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-[44px] h-11 px-4 text-xs gap-1.5 rounded-xl sm:min-h-0 sm:h-9",
  md: "min-h-[48px] h-12 px-6 text-sm gap-2 rounded-2xl sm:min-h-0 sm:h-11",
  lg: "min-h-[52px] h-14 px-8 text-base gap-2.5 rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth,
      loading,
      disabled,
      leftIcon,
      rightIcon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const reduced = usePrefersReducedMotion();

    const buttonEl = (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={cn(
          "inline-flex w-full items-center justify-center font-display font-semibold",
          "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maia-orange/40 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );

    if (reduced) {
      return (
        <span className={cn("inline-flex", fullWidth && "w-full")}>
          {buttonEl}
        </span>
      );
    }

    return (
      <motion.span
        className={cn("inline-flex", fullWidth && "w-full")}
        whileTap={isDisabled ? undefined : press.tap}
        whileHover={isDisabled ? undefined : press.hover}
        transition={springPress}
      >
        {buttonEl}
      </motion.span>
    );
  }
);

Button.displayName = "Button";
