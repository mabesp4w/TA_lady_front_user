/** @format */

import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        clickerscript: ["ClickerScript", "cursive"],
        sofia: ["SofiaPro", "cursive"],
      },
      colors: {
        primary: {
          DEFAULT: "var(--primary-color)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--secondary-color)",
          dark: "#d97706",
        },
        accent: "var(--accent-color)",
      },
      boxShadow: {
        card: "var(--card-shadow)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-in-out",
        "fade-in-right": "fadeInRight 0.5s ease-in-out",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  },
};
export default config;
