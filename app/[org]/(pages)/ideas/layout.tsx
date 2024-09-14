import React from 'react';
import { Suspense } from 'react';

import Loading from '@/app/[org]/(pages)/loading';
import Ideas from '@/app/[org]/(pages)/ideas/default_page';

export default async function RootLayout({
  children,
  params: { org },
}: Readonly<{
  children: React.ReactNode;
  params: {
    org: string;
  };
}>) {
  return (
    <Suspense fallback={<Loading />}>
      <Ideas />
      {children}
    </Suspense>
  );
}
