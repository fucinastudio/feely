'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  BookText,
  HelpCircle,
  LoaderCircle,
  LogOut,
  Settings,
  User,
} from 'lucide-react';

import { logoutUser } from '@/app/api/apiServerActions/userApiServerActions';
import { useAuth } from '@/context/authContext';
import { useWorkspace } from '@/context/workspaceContext';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Separator,
} from '@fucina/ui';

const Navbar = () => {
  const { org, workspace, isLoadingWorkspace } = useWorkspace();
  const pathname = usePathname();
  const orgLetter = org[0];
  // Function to check if the route is active
  const isActive = (route: string) => {
    return pathname.split('/')[2] === route;
  };
  const { user, isAdmin } = useAuth();

  const handleClickAvatar = () => {
    if (workspace?.logoUrl) {
      window.open(workspace?.logoUrl, '_blank');
    }
  };

  const pathName = usePathname();

  const searchParams = useSearchParams();

  const openUserPage = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (user) {
      newSearchParams.set('user', user?.id);
    }

    return `${pathName}?${newSearchParams.toString()}`;
  }, [searchParams, pathName, user]);

  return (
    <div className="z-50 fixed flex justify-center items-center border-default bg-elevated border-b w-full h-14">
      <div className="flex justify-between items-center mx-auto px-10 w-full max-w-screen-xl">
        <div className="flex justify-center items-center space-x-4 h-9">
          <div className="flex justify-center items-center space-x-2 h-9">
            <Avatar
              size="md"
              className="border-default border"
              onClick={handleClickAvatar}
            >
              <AvatarImage src={workspace?.imageUrl} alt={org} />
              <AvatarFallback>{orgLetter}</AvatarFallback>
            </Avatar>
            <h1 className="text-heading-body">
              {workspace?.externalName ?? org}
            </h1>
          </div>
          <Separator orientation="vertical" className="h-7" />
          {isLoadingWorkspace ? (
            <LoaderCircle className="animate-spin stroke-icon" />
          ) : (
            <div className="flex gap-1.5">
              {workspace?.workspaceSettings?.showIdeas && (
                <Button
                  variant="text"
                  asChild
                  className={isActive('ideas') ? 'text-brand' : ''}
                >
                  <Link href={`/${org}/ideas`} scroll={false}>
                    Ideas
                  </Link>
                </Button>
              )}
              {workspace?.workspaceSettings?.showRoadmap && (
                <Button
                  variant="text"
                  asChild
                  className={isActive('roadmap') ? 'text-brand' : ''}
                >
                  <Link href={`/${org}/roadmap`} scroll={false}>
                    Roadmap
                  </Link>
                </Button>
              )}
              {workspace?.workspaceSettings?.showCommunity && (
                <Button
                  variant="text"
                  asChild
                  className={isActive('community') ? 'text-brand' : ''}
                >
                  <Link href={`/${org}/community`} scroll={false}>
                    Community
                  </Link>
                </Button>
              )}
              {isAdmin && (
                <Button
                  variant="text"
                  asChild
                  className={isActive('settings') ? 'text-brand' : ''}
                >
                  <Link href={`/${org}/settings/general`} scroll={false}>
                    Settings
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar
                size="lg"
                className="border-default border hover:cursor-pointer"
              >
                <AvatarImage
                  src={user?.image_url ?? undefined}
                  alt={user?.name ?? undefined}
                />
                <AvatarFallback>{user?.name?.slice(0, 1)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="pb-0 h-7 text">
                {user?.name}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="pt-0 h-7 text-md">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={openUserPage}>
                  <DropdownMenuItem shortcut="⇧⌘P">
                    <User />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${org}/account/settings/profile`} scroll={false}>
                  <DropdownMenuItem>
                    <Settings />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <HelpCircle />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookText />
                  <span>Docs</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                shortcut="⇧⌘Q"
                onClick={async (e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  await logoutUser();
                }}
              >
                <LogOut />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
