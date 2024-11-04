"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { HeartHandshake, X } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Separator,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@fucina/ui";
import { useGetIdeaByUserInWorkspace } from "@/app/api/controllers/ideaController";
import { useGetUserById } from "@/app/api/controllers/userController";
import { useWorkspace } from "@/context/workspaceContext";
import IdeaCard from "@/app/[org]/(pages)/ideas/components/idea";
import Loading from "@/app/loading";
import { useAuth } from "@/context/authContext";

const UserTab = () => {
  const { workspace, org } = useWorkspace();
  const { user: userCurrentlyLogged } = useAuth();
  const searchParams = useSearchParams();
  const userId = searchParams?.get("user");
  const router = useRouter();
  const handleClose = () => {
    if (searchParams) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("user");
      router.push(window.location.pathname + "?" + newParams.toString());
    } else {
      router.push(window.location.pathname);
    }
  };

  const {
    data: userFromDb,
    error: errorGetUserById,
    isLoading: isLoadingGetUserById,
  } = useGetUserById(
    {
      workspaceId: workspace?.id ?? "",
      userId: userId ?? "",
    },
    !!userId && !!workspace?.id
  );
  const user = useMemo(() => {
    //This means that a user is trying to access his own profile but has not interacted with the workspace yet
    if (errorGetUserById && userCurrentlyLogged?.id === userId) {
      return { ...userCurrentlyLogged, points: 0 };
    }
    return userFromDb?.data?.user;
  }, [userFromDb, errorGetUserById, userId, userCurrentlyLogged]);

  const {
    data: ideasByUserInWorkspace,
    isLoading: isLoadingIdeaByUserInWorkspace,
  } = useGetIdeaByUserInWorkspace(
    {
      userId: userId!,
      workspaceId: workspace?.id ?? "",
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
                  <Avatar size="xl" className="sm:flex hidden size-14">
                    <AvatarImage
                      src={user?.image_url ?? undefined}
                      alt={user?.name ?? undefined}
                      className="size-14"
                    />
                    <AvatarFallback className="capitalize size-14">
                      {user?.name ? user?.name[0] : undefined}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <SheetTitle>{user?.name}</SheetTitle>
                    <SheetDescription>
                      <div className="flex justify-start items-center gap-1 text-description text-sm">
                        <HeartHandshake className="size-4" />
                        <p>{user?.points} Karmas</p>
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
            <Tabs defaultValue="ideas" className="p-0">
              <TabsList>
                <TabsTrigger value="ideas">Ideas</TabsTrigger>
                <TabsTrigger
                  value="badges"
                  disabled
                  className="cursor-not-allowed"
                >
                  Badges
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ideas" className="space-y-1 p-0">
                {(isLoadingIdeaByUserInWorkspace || isLoadingGetUserById) && (
                  <Loading className="p-10 w-full" />
                )}
                {ideasByUserInWorkspace?.data.ideas.length === 0 ? (
                  <div className="flex justify-center items-center w-full min-h-[40vh] text-description">
                    <p>No ideas found.</p>
                  </div>
                ) : (
                  ideasByUserInWorkspace?.data.ideas.map((idea, index) => {
                    const isLastItem =
                      index === ideasByUserInWorkspace.data.ideas.length - 1;
                    return (
                      <>
                        <IdeaCard profile idea={idea} org={org} key={idea.id} />
                        {!isLastItem && <Separator />}
                      </>
                    );
                  })
                )}
              </TabsContent>
              <TabsContent value="badges" className="p-0">
                <Loading className="p-10 w-full" />
              </TabsContent>
            </Tabs>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  ) : null;
};

export default UserTab;
