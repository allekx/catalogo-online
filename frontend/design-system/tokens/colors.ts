export const colors = {
  brand: {
    orange: "#FF6B00",
    nude: "#F7E6DA",
    rose: "#E9C7B5",
    white: "#FFFFFF",
  },
  text: {
    primary: "#222222",
    secondary: "#666666",
    tertiary: "#999999",
    inverse: "#FFFFFF",
  },
  semantic: {
    success: "#2D9B6A",
    warning: "#E5A000",
    error: "#D64545",
    info: "#4A90D9",
  },
  surface: {
    base: "#FFFFFF",
    muted: "#F7E6DA",
    accent: "#E9C7B5",
    overlay: "rgba(34, 34, 34, 0.45)",
  },
} as const;

export const cssColorVars = {
  "--ds-color-orange": colors.brand.orange,
  "--ds-color-nude": colors.brand.nude,
  "--ds-color-rose": colors.brand.rose,
  "--ds-color-white": colors.brand.white,
  "--ds-color-text": colors.text.primary,
  "--ds-color-text-muted": colors.text.secondary,
  "--ds-color-text-light": colors.text.tertiary,
} as const;
