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
      </body>
    </html>
  );
}
