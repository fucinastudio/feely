'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useWorkspace } from '@/context/workspaceContext';
import { Button } from '@fucina/ui';

const AccountNavbar = () => {
  const { org } = useWorkspace();
  const pathname = usePathname();
  const isActive = (route: string) => {
    return pathname === `/${org}/${route}`;
  };

  return (
    <div className="flex flex-col gap-1 md:gap-1 my-0 md:my-2 w-full md:w-56 min-w-56">
      <Button
        variant="text"
        asChild
        className={`${
          isActive('account/settings/profile') ? 'text-brand' : ''
        } w-full justify-start`}
      >
        <Link href={`/${org}/account/settings/profile`} scroll={false}>
          Profile
        </Link>
      </Button>
    </div>
  );
};

export default AccountNavbar;
