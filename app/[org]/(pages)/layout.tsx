import { Suspense } from 'react';

import Loading from '@/app/loading';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<Loading className="min-h-[80vh] size-full" />}>
      {children}
    </Suspense>
  );
}
