import { Suspense } from 'react';
import Link from 'next/link';

import Loading from '@/app/loading';
import RoadmapPage from '@/app/[org]/(pages)/roadmap/default_page';
import { Button, Separator } from '@fucina/ui';

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
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-heading-section">Roadmap</h2>
        <Button asChild>
          <Link href={`/${org}/roadmap/new_idea`}>New idea</Link>
        </Button>
      </div>
      <Separator />
      <Suspense fallback={<Loading className="min-h-[60vh] size-full" />}>
        <RoadmapPage />
        {children}
      </Suspense>
    </div>
  );
}
