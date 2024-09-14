import { Suspense } from 'react';
import Loading from '@/app/[org]/(pages)/loading';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
