/** @format */

// src/utils/fonts.ts
import { Poppins, Playfair_Display } from "next/font/google";

// Font untuk heading
export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

// Font untuk body text
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});
