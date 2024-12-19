import { Analytics } from '@vercel/analytics/react';
import { GoogleTagManager } from '@next/third-parties/google';

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
      <body className={getFontClasses()}>
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
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
      </body>
    </html>
  );
}
