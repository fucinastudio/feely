import { Analytics } from '@vercel/analytics/react';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

import { ToastProvider } from '@fucina/ui';
import { ThemeProvider } from '@/components/theme-provider';
import ReactQueryProvider from '@/context/queryClient';
import { metadata } from '@/lib/metadata';

import { getFontClasses } from '@/styles/fonts/font';
import '@/styles/globals.css';

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <GoogleTagManager gtmId="GTM-5FJ9D5DV" />
      <GoogleAnalytics gaId="G-9BX851TF15" />
      <body className={getFontClasses()}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5FJ9D5DV"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <ToastProvider />
        <Analytics />
      </body>
    </html>
  );
}
