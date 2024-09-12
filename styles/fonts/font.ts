import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const brand = localFont({
  src: "./brand.woff2",
  display: "swap",
  variable: "--font-brand",
});

export const logo = localFont({
  src: "./logo.woff2",
  display: "swap",
  variable: "--font-logo",
});


