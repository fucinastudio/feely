import { Suspense } from 'react';

import Loading from '@/app/[org]/(pages)/loading';

export default async function RootLayout({
  children,
  params: { org },
}: Readonly<{
  children: React.ReactNode;
  params: {
    org: string;
  };
}>) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
