'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { Separator, Sheet, SheetContent } from '@fucina/ui';
import { useGetIdeaByUserInWorkspace } from '@/app/api/controllers/ideaController';
import { useGetUserById } from '@/app/api/controllers/userController';
import { useWorkspace } from '@/context/workspaceContext';

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
        <SheetContent className="flex flex-col space-y-4 p-10 min-w-[476px]">
          {isLoadingGetUserById ? (
            <div>Loading</div>
          ) : (
            <div className="flex flex-col space-y-1">
              <h2 className="text-heading-body">{user?.name}</h2>
              <p className="text-description text-md">{user?.email}</p>
            </div>
          )}
          <Separator />
          {(isLoadingIdeaByUserInWorkspace || isLoadingGetUserById) && (
            <div>Loading...</div>
          )}
          {errorGetUserById && <div>{errorGetUserById}</div>}
          {ideasByUserInWorkspace?.data.ideas.map((idea) => {
            return <>{idea.title}</>;
          })}
        </SheetContent>
      </Sheet>
    </div>
  ) : null;
};

export default UserTab;
