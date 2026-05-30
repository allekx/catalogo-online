import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <Link href={ROUTES.home} className={cn("inline-block", className)}>
      <span
        className={cn(
          "font-display font-bold tracking-tight text-maia-text",
          sizes[size]
        )}
      >
        Le <span className="text-maia-orange">Maia</span>
      </span>
    </Link>
  );
}
