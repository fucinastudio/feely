import { Suspense } from 'react';

import { cn } from '@fucina/utils';
import Logo from '@/components/logo';
import Loading from '@/app/(auth)/loading';
import GridPattern from '@/components/grid-pattern';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col justify-center items-center p-5 sm:p-6 w-screen h-screen">
      <Logo className="top-6 left-6 z-50 absolute" />
      <Suspense fallback={<Loading />}>{children}</Suspense>
      <GridPattern
        width={32}
        height={32}
        x={-1}
        y={-1}
        strokeDasharray={'4 4'}
        className={cn(
          '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
        )}
      />
    </div>
  );
}
