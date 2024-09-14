import { Suspense } from 'react';

import Loading from '@/app/[org]/(pages)/loading';
import RoadmapPage from '@/app/[org]/(pages)/roadmap/default_page';

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
      <RoadmapPage />
      {children}
    </Suspense>
  );
}
