'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { LoaderCircle, Dot, X } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ScrollArea,
  Separator,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@fucina/ui';
import { useGetIdeaByUserInWorkspace } from '@/app/api/controllers/ideaController';
import { useGetUserById } from '@/app/api/controllers/userController';
import { useWorkspace } from '@/context/workspaceContext';
import IdeaCard from '@/app/[org]/(pages)/ideas/components/idea';

const UserTab = () => {
  const { workspace, org } = useWorkspace();
  const searchParams = useSearchParams();
  const userId = searchParams.get('user');
  const router = useRouter();
  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('user');
    router.push(window.location.pathname + '?' + newParams.toString());
  };

  const {
    data: userFromDb,
    error: errorGetUserById,
    isLoading: isLoadingGetUserById,
  } = useGetUserById(
    {
      workspaceId: workspace?.id ?? '',
      userId: userId ?? '',
    },
    !!userId && !!workspace?.id
  );

  const user = userFromDb?.data.user;

  const {
    data: ideasByUserInWorkspace,
    isLoading: isLoadingIdeaByUserInWorkspace,
  } = useGetIdeaByUserInWorkspace(
    {
      userId: userId!,
      workspaceId: workspace?.id ?? '',
    },
    !!user && !!userId && !!workspace
  );
  return userId ? (
    <div>
      <Sheet
        open={true}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <SheetContent>
          <div className="flex justify-between items-start gap-x-4">
            <div className="flex flex-col gap-y-1 mt-1">
              {isLoadingGetUserById ? (
                <div className="flex justify-start items-center gap-3">
                  <Skeleton shape="circle" className="sm:flex hidden size-14" />
                  <div className="flex flex-col gap-1">
                    <SheetTitle>
                      <Skeleton shape="line" className="rounded w-56 h-7" />
                    </SheetTitle>
                    <SheetDescription>
                      <Skeleton shape="line" className="rounded w-48 h-6" />
                    </SheetDescription>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start items-center gap-3">
                  <Avatar
                    size="xl"
                    className="sm:flex border-default hidden border size-14"
                  >
                    <AvatarImage
                      src={user?.image_url ?? undefined}
                      alt={user?.name ?? undefined}
                      className="size-14"
                    />
                    <AvatarFallback className="size-14">
                      {user?.name ? user?.name[0] : undefined}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <SheetTitle>{user?.name}</SheetTitle>
                    <SheetDescription>
                      <div className="flex justify-start items-center gap-0 text-description text-sm">
                        <p>🪬 {user?.email} karmas</p>
                        <Dot />
                        <p>🏅 7 badges</p>
                      </div>
                    </SheetDescription>
                  </div>
                </div>
              )}
            </div>
            <SheetClose asChild>
              <Button size="small" icon={true} variant="text">
                <X className="size-6" aria-hidden="true" />
              </Button>
            </SheetClose>
          </div>
          <SheetBody>
            <Tabs defaultValue="badges" className="p-0">
              <TabsList>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="ideas">Ideas</TabsTrigger>
              </TabsList>
              <TabsContent value="badges">
                <div className="flex justify-center items-center p-10 w-full">
                  <LoaderCircle className="animate-spin stroke-brand-600" />
                </div>
              </TabsContent>
              <TabsContent value="ideas" className="space-y-1 p-0">
                {(isLoadingIdeaByUserInWorkspace || isLoadingGetUserById) && (
                  <div className="flex justify-center items-center p-10 w-full">
                    <LoaderCircle className="animate-spin stroke-brand-600" />
                  </div>
                )}
                {errorGetUserById && <div>{errorGetUserById}</div>}
                {ideasByUserInWorkspace?.data.ideas.map((idea, index) => {
                  const isLastItem =
                    index === ideasByUserInWorkspace.data.ideas.length - 1;
                  return (
                    <>
                      <IdeaCard profile idea={idea} org={org} key={idea.id} />
                      {!isLastItem && <Separator />}
                    </>
                  );
                })}
              </TabsContent>
            </Tabs>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  ) : null;
};

export default UserTab;
