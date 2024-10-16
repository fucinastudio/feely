'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useWorkspace } from '@/context/workspaceContext';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@fucina/ui';

const SettingsNavbar = () => {
  const { org } = useWorkspace();
  const pathname = usePathname();
  const isActive = (route: string) => {
    return pathname === `/${org}/${route}`;
  };

  return (
    <NavigationMenu className="justify-start my-0 md:my-2 w-full md:w-56 min-w-56 [&>div]:w-full">
      <NavigationMenuList
        orientation="vertical"
        className="gap-0 sm:gap-1 w-full"
      >
        <NavigationMenuItem className="w-full">
          <Link
            href={`/${org}/settings/general`}
            scroll={false}
            legacyBehavior
            passHref
            className="w-full"
          >
            <NavigationMenuLink
              active={isActive('settings/general')}
              className="justify-start w-full"
            >
              General
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <Link href={`/${org}/settings/members`} legacyBehavior passHref>
            <NavigationMenuLink
              active={isActive('settings/members')}
              className="justify-start w-full"
            >
              Members
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <Link href={`/${org}/settings/topics`} legacyBehavior passHref>
            <NavigationMenuLink
              active={isActive('settings/topics')}
              className="justify-start w-full"
            >
              Topics
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <Link href={`/${org}/settings/theme`} legacyBehavior passHref>
            <NavigationMenuLink
              active={isActive('settings/theme')}
              className="justify-start w-full"
            >
              Theme
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <Link
            href={`/${org}/settings/site-navigation`}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              active={isActive('settings/site-navigation')}
              className="justify-start w-full"
            >
              Site navigation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <Link href="#" legacyBehavior passHref>
            <NavigationMenuLink className="justify-start w-full">
              Billing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default SettingsNavbar;
