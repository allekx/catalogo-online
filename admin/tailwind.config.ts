import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maia: {
          orange: "#FF6B00",
          nude: "#F7E6DA",
          rose: "#E9C7B5",
          text: "#222222",
          muted: "#6B6B6B",
        },
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
