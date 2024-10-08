import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import localFont from 'next/font/local';

export const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const brand = localFont({
  src: './brand.woff2',
  display: 'swap',
  variable: '--font-brand',
});

export const logo = localFont({
  src: './logo.woff2',
  display: 'swap',
  variable: '--font-logo',
});

export const geist = GeistSans;

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
