import { Suspense } from 'react';

import { Separator } from '@fucina/ui';
import Loading from '@/app/[org]/(pages)/settings/loading';
import SettingsNavbar from '@/components/org/settings-navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-start items-center w-full">
        <h2 className="text-heading-section">Settings</h2>
      </div>
      <Separator />
      <div className="flex items-start gap-10">
        <SettingsNavbar />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
