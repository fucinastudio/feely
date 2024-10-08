'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LogOut,
  Settings,
  User,
  Menu,
  Grip,
  CirclePlus,
  Sun,
  Moon,
  Monitor,
  CircleFadingPlus,
  Map,
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
  Skeleton,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  SheetClose,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuTrigger,
  DropdownMenuSubMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from '@fucina/ui';
import { cn, focusRing } from '@fucina/utils';
import UserProfileLinkComponent from '@/components/userProfileLinkComponent';

const Navbar = () => {
  const { setTheme, theme } = useTheme();

  const { org, workspace, isLoadingWorkspace } = useWorkspace();
  const pathname = usePathname();
  const orgLetter = org[0];
  // Function to check if the route is active
  const isActive = (route: string) => {
    return pathname?.split('/')[2] === route;
  };
  const { user, isAdmin } = useAuth();

  const handleClickButton = () => {
    if (workspace?.logoUrl) {
      window.open(workspace?.logoUrl, '_blank');
    }
  };
  return (
    <div className="z-50 fixed flex justify-center items-center border-default bg-background border-b w-full h-14">
      <div className="flex justify-between items-center mx-auto px-5 sm:px-10 w-full max-w-screen-xl">
        <div className="flex justify-center items-center space-x-4 h-9">
          <button
            onClick={handleClickButton}
            className={cn('rounded', focusRing)}
          >
            <div className="flex justify-center items-center space-x-2 h-9">
              <Avatar size="md">
                <AvatarImage src={workspace?.imageUrl} alt={org} />
                <AvatarFallback className="capitalize">
                  {orgLetter}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-heading-body capitalize">
                {workspace?.externalName ?? org}
              </h1>
            </div>
          </button>
          <Separator orientation="vertical" className="md:flex hidden h-7" />
          {isLoadingWorkspace ? (
            <div className="md:flex items-center gap-1.5 hidden">
              <Skeleton className="w-20 h-7" />
              <Skeleton className="w-20 h-7" />
              <Skeleton className="w-20 h-7" />
            </div>
          ) : (
            <NavigationMenu className="md:flex gap-1.5 hidden">
              <NavigationMenuList orientation="horizontal">
                {workspace?.workspaceSettings?.showIdeas && (
                  <NavigationMenuItem>
                    <Link
                      href={`/${org}/ideas`}
                      scroll={false}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink active={isActive('ideas')}>
                        Ideas
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
                {workspace?.workspaceSettings?.showRoadmap && (
                  <NavigationMenuItem>
                    <Link
                      href={`/${org}/roadmap`}
                      scroll={false}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink active={isActive('roadmap')}>
                        Roadmap
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
                {workspace?.workspaceSettings?.showCommunity && (
                  <NavigationMenuItem>
                    <Link
                      href={`/${org}/community`}
                      scroll={false}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink active={isActive('community')}>
                        Community
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
                {isAdmin && (
                  <NavigationMenuItem>
                    <Link
                      href={`/${org}/settings/general`}
                      scroll={false}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink active={isActive('settings')}>
                        Settings
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        <div className="md:flex space-x-2 hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn('rounded-full', focusRing)}>
              <Avatar size="lg" className="hover:cursor-pointer">
                <AvatarImage
                  src={user?.image_url ?? undefined}
                  alt={user?.name ?? undefined}
                />
                <AvatarFallback className="capitalize">
                  {user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="pt-1 pb-0 h-7 !text">
                {user?.name}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="pt-0 pb-1 h-7 !font-normal text-md">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <UserProfileLinkComponent userId={user?.id ?? null}>
                  <DropdownMenuItem>
                    <User />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </UserProfileLinkComponent>
                <Link href={`/${org}/account/settings/profile`} scroll={false}>
                  <DropdownMenuItem>
                    <Settings />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                {/*
                {isAdmin && (
                  <DropdownMenuSubMenu>
                    <DropdownMenuSubMenuTrigger>
                      <Grip />
                      <span>Workspaces</span>
                    </DropdownMenuSubMenuTrigger>
                    <DropdownMenuSubMenuContent className="w-64">
                      <DropdownMenuRadioGroup value="fucina">
                        <DropdownMenuRadioItem value="fucina">
                          <Avatar size="sm">
                            <AvatarImage
                              src={workspace?.imageUrl ?? undefined}
                              alt={workspace?.externalName ?? undefined}
                            />
                            <AvatarFallback className="capitalize">
                              {workspace?.externalName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>Fucina</span>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="pedro">
                          <Avatar size="sm">
                            <AvatarImage
                              src={workspace?.imageUrl ?? undefined}
                              alt={workspace?.externalName ?? undefined}
                            />
                            <AvatarFallback className="capitalize">
                              {workspace?.externalName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>Pedro</span>
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <CirclePlus />
                        <span>Create new Workspace</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubMenuContent>
                  </DropdownMenuSubMenu>
                )}
                */}
                <DropdownMenuSubMenu>
                  <DropdownMenuSubMenuTrigger>
                    {theme === 'dark' ? (
                      <>
                        <Moon /> <span>Theme</span>
                      </>
                    ) : theme === 'light' ? (
                      <>
                        <Sun /> <span>Theme</span>
                      </>
                    ) : (
                      <>
                        <Monitor /> <span>Theme</span>
                      </>
                    )}
                  </DropdownMenuSubMenuTrigger>
                  <DropdownMenuSubMenuContent className="w-40">
                    <DropdownMenuRadioGroup value={theme}>
                      <DropdownMenuRadioItem
                        value="light"
                        onClick={() => setTheme('light')}
                      >
                        <Sun />
                        <span>Light</span>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="dark"
                        onClick={() => setTheme('dark')}
                      >
                        <Moon />
                        <span>Dark</span>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="system"
                        onClick={() => setTheme('system')}
                      >
                        <Monitor />
                        <span>System</span>
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubMenuContent>
                </DropdownMenuSubMenu>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={'https://app.feely.so/feely/ideas'} target="_blank">
                  <DropdownMenuItem>
                    <CircleFadingPlus />
                    <span>Feature requests</span>
                  </DropdownMenuItem>
                </Link>
                <Link
                  href={`https://app.feely.so/feely/roadmap`}
                  target="_blank"
                >
                  <DropdownMenuItem>
                    <Map />
                    <span>Roadmap</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
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
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger>
              <Button variant="secondary" icon>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{workspace?.externalName ?? org}</SheetTitle>
              </SheetHeader>
              <SheetBody className="w-full">
                {isLoadingWorkspace ? (
                  <div className="flex flex-col justify-start gap-1.5 w-full">
                    <Skeleton className="w-20 h-7" />
                    <Skeleton className="w-20 h-7" />
                    <Skeleton className="w-20 h-7" />
                  </div>
                ) : (
                  <NavigationMenu className="w-full">
                    <NavigationMenuList
                      orientation="vertical"
                      className="w-full"
                    >
                      {workspace?.workspaceSettings?.showIdeas && (
                        <NavigationMenuItem className="w-full">
                          <SheetClose asChild>
                            <Link href={`/${org}/ideas`} scroll={false}>
                              <NavigationMenuLink
                                active={isActive('ideas')}
                                className="justify-start w-full"
                              >
                                Ideas
                              </NavigationMenuLink>
                            </Link>
                          </SheetClose>
                        </NavigationMenuItem>
                      )}
                      {workspace?.workspaceSettings?.showRoadmap && (
                        <NavigationMenuItem className="w-full">
                          <SheetClose asChild>
                            <Link href={`/${org}/roadmap`} scroll={false}>
                              <NavigationMenuLink
                                active={isActive('roadmap')}
                                className="justify-start w-full"
                              >
                                Roadmap
                              </NavigationMenuLink>
                            </Link>
                          </SheetClose>
                        </NavigationMenuItem>
                      )}
                      {workspace?.workspaceSettings?.showCommunity && (
                        <NavigationMenuItem className="w-full">
                          <SheetClose asChild>
                            <Link href={`/${org}/community`} scroll={false}>
                              <NavigationMenuLink
                                active={isActive('community')}
                                className="justify-start w-full"
                              >
                                Community
                              </NavigationMenuLink>
                            </Link>
                          </SheetClose>
                        </NavigationMenuItem>
                      )}
                      {isAdmin && (
                        <NavigationMenuItem className="w-full">
                          <SheetClose asChild>
                            <Link
                              href={`/${org}/settings/general`}
                              scroll={false}
                            >
                              <NavigationMenuLink
                                active={isActive('settings')}
                                className="justify-start w-full"
                              >
                                Settings
                              </NavigationMenuLink>
                            </Link>
                          </SheetClose>
                        </NavigationMenuItem>
                      )}
                    </NavigationMenuList>
                  </NavigationMenu>
                )}
                <Separator orientation="horizontal" className="my-4" />
                <NavigationMenu className="w-full">
                  <NavigationMenuList orientation="vertical" className="w-full">
                    <NavigationMenuItem className="w-full">
                      <UserProfileLinkComponent
                        userId={user?.id ?? null}
                        scroll={false}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink className="justify-start w-full">
                          <User />
                          Profile
                        </NavigationMenuLink>
                      </UserProfileLinkComponent>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="w-full">
                      <SheetClose asChild>
                        <Link
                          href={`/${org}/account/settings/profile`}
                          scroll={false}
                        >
                          <NavigationMenuLink
                            active={isActive('account')}
                            className="justify-start w-full"
                          >
                            <Settings />
                            Account Settings
                          </NavigationMenuLink>
                        </Link>
                      </SheetClose>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <Separator orientation="horizontal" className="my-4" />
                <NavigationMenu className="w-full">
                  <NavigationMenuList orientation="vertical" className="w-full">
                    <NavigationMenuItem className="w-full">
                      <Link href="https://app.feely.so/ideas" target="_blank">
                        <NavigationMenuLink className="justify-start w-full">
                          <CircleFadingPlus />
                          Feature requests
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="w-full">
                      <Link href="https://app.feely.so/roadmap" target="_blank">
                        <NavigationMenuLink className="justify-start w-full">
                          <Map />
                          Roadmap
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <Separator orientation="horizontal" className="my-4" />
                <NavigationMenu className="w-full">
                  <NavigationMenuList orientation="vertical" className="w-full">
                    <NavigationMenuItem className="w-full">
                      <NavigationMenuLink
                        onClick={async (e: any) => {
                          e.preventDefault();
                          e.stopPropagation();
                          await logoutUser();
                        }}
                        className="justify-start w-full"
                      >
                        <LogOut />
                        Log out
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
