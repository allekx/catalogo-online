import { Inter, Poppins } from "next/font/google";

/** Pesos mínimos — reduz payload no mobile (Lighthouse) */
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const fontVariables = `${poppins.variable} ${inter.variable}`;
