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
        sans: ["var(--font-poppins)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
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
    themes: [
      {
        light: {
          primary: "#2563eb",
          secondary: "#f59e0b",
          accent: "#10b981",
        },
      },
    ],
  },
};
export default config;
