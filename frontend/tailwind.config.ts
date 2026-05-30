import type { Config } from "tailwindcss";
import { colors } from "./design-system/tokens/colors";
import { shadows } from "./design-system/tokens/shadows";
import { radius } from "./design-system/tokens/radius";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./design-system/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        maia: {
          orange: colors.brand.orange,
          nude: colors.brand.nude,
          rose: colors.brand.rose,
          white: colors.brand.white,
          text: colors.text.primary,
          muted: colors.text.secondary,
          light: colors.text.tertiary,
        },
        semantic: colors.semantic,
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "nav-height": "4.5rem",
        "bottom-nav": "5rem",
      },
      maxWidth: {
        /** iPhone / mobile — coluna única estilo app */
        app: "480px",
        /** Tablet portrait */
        "app-tablet": "720px",
        /** Tablet landscape / desktop conteúdo */
        "app-wide": "960px",
      },
      borderRadius: {
        ...radius,
      },
      boxShadow: {
        ...shadows,
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
