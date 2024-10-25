"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@fucina/ui";
import { useWorkspace } from "@/context/workspaceContext";

export default function BrandBadge() {
  const { workspace } = useWorkspace();
  return workspace?.workspaceSettings?.showBranding ? (
    <Button
      asChild
      className="bottom-4 left-4 fixed bg-inverse shadow-md px-1.5 py-[5px] rounded max-w-60 h-7 font-brand font-medium text-inverse text-md leading-5 select-none"
    >
      <Link href="https://feely.so" target="_blank">
        💜 Made with Feely
      </Link>
    </Button>
  ) : null;
}
