import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#31aaa0",
          dark: "#1a2c2a",
        },
        surface: {
          DEFAULT: "#f2f2f2",
          dark: "#445251",
        },
      },
      fontFamily: {
        manrope: ["var(--font-manrope)", "sans-serif"],
        kdam: ["var(--font-kdam)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
