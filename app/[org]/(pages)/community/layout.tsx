import { Suspense } from 'react';

import Loading from '@/app/loading';
import { Separator } from '@fucina/ui';

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
      <div className="flex justify-start items-center w-full">
        <h2 className="text-heading-section">Community</h2>
      </div>
      <Separator />
      <Suspense fallback={<Loading className="min-h-[80vh] size-full" />}>
        {children}
      </Suspense>
    </div>
  );
}
