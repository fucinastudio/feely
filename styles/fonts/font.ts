import { Inter, Poppins, Roboto, Work_Sans, Raleway } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import localFont from 'next/font/local';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const brand = localFont({
  src: './brand.woff2',
  display: 'swap',
  variable: '--font-brand',
});

const logo = localFont({
  src: './logo.woff2',
  display: 'swap',
  variable: '--font-logo',
});

const geist = GeistSans;

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500'],
  variable: '--font-poppins',
});

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
});

const worksans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-worksans',
});

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700', '800'],
  variable: '--font-raleway',
});

export function getFontClasses(): string {
  return `${sans.variable} ${brand.variable} ${logo.variable} ${inter.variable} ${geist.variable} ${geist.variable} ${poppins.variable} ${roboto.variable} ${worksans.variable} ${raleway.variable}`;
}
