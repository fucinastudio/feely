import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import Loading from '@/app/[org]/loading';
import UserTab from '@/app/[org]/userTab';
import { checkWorkspaceExistanceServer } from '@/app/api/apiServerActions/workspaceApiServerActions';
import protectRoute from '@/utils/protectedRoute';
import { WorkspaceProvider } from '@/context/workspaceContext';
import { AuthProvider } from '@/context/authContext';
import Navbar from '@/components/org/navbar';

export default async function RootLayout({
  children,
  params: { org },
}: Readonly<{
  children: React.ReactNode;
  params: {
    org: string;
  };
}>) {
  const user = await protectRoute(`/${org}`);
  const exists = await checkWorkspaceExistanceServer(org);
  if (!exists) {
    redirect('/');
  } else
    return (
      <Suspense fallback={<Loading />}>
        <WorkspaceProvider org={org}>
          <AuthProvider>
            <Navbar />
            <div className="flex justify-center mx-auto min-h-screen size-full">
              <div className="px-5 sm:px-10 pt-24 pb-10 max-w-screen-xl size-full">
                <UserTab />
                {children}
              </div>
            </div>
          </AuthProvider>
        </WorkspaceProvider>
      </Suspense>
    );
}
