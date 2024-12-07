"use client";

import React from "react";
import { Suspense } from "react";
import Link from "next/link";

import Loading from "@/app/loading";
import Ideas from "@/app/[org]/(pages)/ideas/default_page";
import { Button, Separator } from "@fucina/ui";
import { useWorkspace } from "@/context/workspaceContext";

export default async function RootLayout({
  children,
  params: { org },
}: Readonly<{
  children: React.ReactNode;
  params: {
    org: string;
  };
}>) {
  const { workspace } = useWorkspace();
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-heading-section">Ideas</h2>
        {workspace?.workspaceSettings?.allowNewIdeas && (
          <Button asChild>
            <Link href={`/${org}/ideas/new_idea`}>New idea</Link>
          </Button>
        )}
      </div>
      <Separator />
      <Suspense fallback={<Loading className="min-h-[60vh] size-full" />}>
        <Ideas />
        {children}
      </Suspense>
    </div>
  );
}
