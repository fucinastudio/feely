import { Suspense } from "react";
import { redirect } from "next/navigation";

import Loading from "@/app/loading";
import UserTab from "@/app/[org]/userTab";
import {
  checkWorkspaceExistanceServer,
  getWorkspaceByName,
} from "@/app/api/apiServerActions/workspaceApiServerActions";
import protectRoute from "@/utils/protectedRoute";
import { WorkspaceProvider } from "@/context/workspaceContext";
import { AuthProvider } from "@/context/authContext";
import Navbar from "@/components/org/navbar";
import BrandBadge from "@/components/org/brand-badge";
import { Metadata } from "next";

async function getOrgData(org: string) {
  const workspace = await getWorkspaceByName(org);
  if (!workspace) {
    throw new Error("Not found");
  }
  return { name: workspace?.externalName || org };
}

export async function generateMetadata({
  params,
}: {
  params: { org: string };
}): Promise<Metadata> {
  console.log("Params", params);
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
    redirect("/");
  } else
    return (
      <Suspense
        fallback={<Loading className="min-w-screen min-h-screen size-full" />}
      >
        <WorkspaceProvider org={org}>
          <AuthProvider>
            <Navbar />
            <div className="flex justify-center mx-auto min-h-screen size-full">
              <div className="px-5 sm:px-10 pt-24 pb-10 max-w-screen-xl size-full">
                <UserTab />
                {children}
              </div>
            </div>
            <BrandBadge />
          </AuthProvider>
        </WorkspaceProvider>
      </Suspense>
    );
}
