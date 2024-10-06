import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import Loading from '@/app/loading';
import UserTab from '@/app/[org]/userTab';
import { checkWorkspaceExistanceServer } from '@/app/api/apiServerActions/workspaceApiServerActions';
import protectRoute from '@/utils/protectedRoute';
import { WorkspaceProvider } from '@/context/workspaceContext';
import { AuthProvider } from '@/context/authContext';
import Navbar from '@/components/org/navbar';

async function getOrgData(org: string) {
  const exists = await checkWorkspaceExistanceServer(org);
  if (!exists) {
    throw new Error('Not found');
  }
  return { name: org };
}

export async function generateMetadata({
  params,
}: {
  params: { org: string };
}): Promise<Metadata> {
  const org = await getOrgData(params.org);

  return {
    title: `${org.name}`,
  };
}

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
      <Suspense fallback={<Loading className="w-screen h-screen" />}>
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
