export const COLORS = {
  orange: "#FF6B00",
  nude: "#F7E6DA",
  rose: "#E9C7B5",
  white: "#FFFFFF",
  text: "#222222",
  textMuted: "#666666",
  textLight: "#999999",
} as const;

export type ColorKey = keyof typeof COLORS;
