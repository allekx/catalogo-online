export const typography = {
  fontFamily: {
    display: "var(--font-poppins), system-ui, sans-serif",
    body: "var(--font-inter), system-ui, sans-serif",
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
    wider: "0.05em",
  },
} as const;

export type TypographyVariant =
  | "display-lg"
  | "display-md"
  | "display-sm"
  | "heading"
  | "subheading"
  | "body"
  | "body-sm"
  | "caption"
  | "label";

export const typographyVariants: Record<TypographyVariant, string> = {
  "display-lg": "font-display text-4xl font-bold tracking-tight",
  "display-md": "font-display text-3xl font-bold tracking-tight",
  "display-sm": "font-display text-2xl font-semibold tracking-tight",
  heading: "font-display text-xl font-semibold tracking-tight",
  subheading: "font-display text-lg font-medium",
  body: "font-body text-base font-normal",
  "body-sm": "font-body text-sm font-normal",
  caption: "font-body text-xs font-normal text-maia-muted",
  label: "font-display text-xs font-semibold uppercase tracking-wider",
};
