import type { Metadata } from 'next';

import { ToastProvider } from '@fucina/ui';
import { ThemeProvider } from '@/components/theme-provider';
import ReactQueryProvider from '@/context/queryClient';

import { sans, geist, inter, brand, logo } from '@/styles/fonts/font';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Feely - User feedbacks get real by being rewarded',
  description: 'User feedbacks get real by being rewarded',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${brand.variable} ${logo.variable} ${inter.variable} ${geist.variable} font-sans`}
      >
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
      </body>
    </html>
  );
}
