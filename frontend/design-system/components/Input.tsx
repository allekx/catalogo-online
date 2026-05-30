"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, leftIcon, rightIcon, className, id, ...props },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block font-display text-sm font-medium text-maia-text"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-maia-light">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-2xl border bg-white font-body text-sm text-maia-text",
              "placeholder:text-maia-light",
              "transition-colors duration-200",
              "focus:border-maia-orange focus:outline-none focus:ring-2 focus:ring-maia-orange/20",
              error
                ? "border-semantic-error"
                : "border-maia-rose/40 hover:border-maia-rose/70",
              leftIcon ? "pl-11 pr-4" : "px-4",
              rightIcon ? "pr-11" : "",
              "h-12 py-3",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-maia-light">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1.5 font-body text-xs text-semantic-error">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 font-body text-xs text-maia-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
