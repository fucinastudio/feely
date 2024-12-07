"use client";

import { Suspense } from "react";

import Loading from "@/app/loading";
import { useWorkspace } from "@/context/workspaceContext";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { org, workspace } = useWorkspace();
  if (!workspace?.workspaceSettings)
    return <Loading className="min-h-[80vh] size-full" />;
  //If new ideas are not allowed, redirect to the home page
  if (!workspace.workspaceSettings.allowNewIdeas) {
    redirect(`/${org}/roadmap`);
  }
  return (
    <Suspense fallback={<Loading className="min-h-[80vh] size-full" />}>
      {children}
    </Suspense>
  );
}
