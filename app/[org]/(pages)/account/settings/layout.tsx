import { Suspense } from 'react';

import { Separator } from '@fucina/ui';
import Loading from '@/app/loading';
import AccountNavbar from '@/components/org/account-navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-start items-center w-full">
        <h2 className="text-heading-section">Account Settings</h2>
      </div>
      <Separator />
      <div className="flex md:flex-row flex-col items-start gap-4 md:gap-10">
        <AccountNavbar />
        <Suspense fallback={<Loading className="min-h-[60vh] size-full" />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
