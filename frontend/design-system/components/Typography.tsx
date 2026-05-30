import { cn } from "@/lib/utils/cn";
import {
  typographyVariants,
  type TypographyVariant,
} from "../tokens/typography";

interface TypographyProps {
  variant?: TypographyVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "label";
  className?: string;
  children: React.ReactNode;
}

const defaultElement: Record<TypographyVariant, TypographyProps["as"]> = {
  "display-lg": "h1",
  "display-md": "h1",
  "display-sm": "h2",
  heading: "h2",
  subheading: "h3",
  body: "p",
  "body-sm": "p",
  caption: "p",
  label: "label",
};

export function Typography({
  variant = "body",
  as,
  className,
  children,
}: TypographyProps) {
  const Component = as ?? defaultElement[variant] ?? "p";

  return (
    <Component className={cn(typographyVariants[variant], className)}>
      {children}
    </Component>
  );
}
