'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useWorkspace } from '@/context/workspaceContext';
import { Button } from '@fucina/ui';

const SettingsNavbar = () => {
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
          isActive('settings/general') ? 'text-brand' : ''
        } w-full justify-start`}
      >
        <Link href={`/${org}/settings/general`} scroll={false}>
          General
        </Link>
      </Button>
      <Button
        variant="text"
        asChild
        className={`${
          isActive('settings/members') ? 'text-brand' : ''
        } w-full justify-start`}
      >
        <Link href={`/${org}/settings/members`} scroll={false}>
          Members
        </Link>
      </Button>
      <Button
        variant="text"
        asChild
        className={`${
          isActive('settings/topics') ? 'text-brand' : ''
        } w-full justify-start`}
      >
        <Link href={`/${org}/settings/topics`} scroll={false}>
          Topics
        </Link>
      </Button>
      <Button
        variant="text"
        asChild
        className={`${
          isActive('settings/theme') ? 'text-brand' : ''
        } w-full justify-start`}
      >
        <Link href={`/${org}/settings/theme`} scroll={false}>
          Theme
        </Link>
      </Button>
      <Button
        variant="text"
        asChild
        className={`${
          isActive('settings/site-navigation') ? 'text-brand' : ''
        } w-full justify-start`}
      >
        <Link href={`/${org}/settings/site-navigation`}>Site navigation</Link>
      </Button>
      <Button variant="text" asChild className="justify-start w-full">
        <Link href="#">Billing</Link>
      </Button>
    </div>
  );
};

export default SettingsNavbar;
