'use client';

import React from 'react';
import Link from 'next/link';
import { LoaderCircle, Inbox } from 'lucide-react';

import { Button, Card, Separator } from '@fucina/ui';
import { useGetIdeasByWorkspaceName } from '@/app/api/controllers/ideaController';
import IdeaCard from '@/app/[org]/(pages)/ideas/components/idea';
import { useWorkspace } from '@/context/workspaceContext';
import Loading from '@/app/[org]/(pages)/loading';
import useMainPageFilters from '@/components/filters/filters';
import FiltersComponentObject from '@/components/filters/filtersComponent';

const Ideas = () => {
  const { org, workspace, statuses, topics } = useWorkspace();

  const {
    filterObjectAttributes,
    mainSearchTitle,
    selectedStatuses,
    selectedTopics,
    selectedOrder,
  } = useMainPageFilters({
    statuses: statuses ?? [],
    topics: topics ?? [],
  });

  const { data: ideas, isLoading: isLoadingIdeas } = useGetIdeasByWorkspaceName(
    {
      workspaceName: org,
      title: mainSearchTitle,
      topicId: selectedTopics.length === 0 ? undefined : selectedTopics,
      statusId: selectedStatuses.length === 0 ? undefined : selectedStatuses,
      orderBy: selectedOrder,
    }
  );
  if (!workspace?.workspaceSettings?.showIdeas) {
    return (
      <div className="flex justify-center items-center w-full h-56">
        <LoaderCircle className="animate-spin stroke-icon-brand" />
      </div>
    );
  }
  return (
    <>
      {/*Filters */}
      <FiltersComponentObject {...filterObjectAttributes} />
      <Card className="flex flex-col space-y-1 border-default bg-background p-1 border rounded-lg w-full">
        {!statuses || !topics || isLoadingIdeas ? (
          <Loading />
        ) : ideas?.data.ideas.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-3 p-10 w-full text-description">
            <Inbox className="size-8 stroke-icon" />
            <div className="flex flex-col gap-1 w-full">
              <h3 className="font-semibold text-center text-lg">
                No ideas found
              </h3>
              <p className="text-center">
                There are no ideas in this workspace. You can create the first
                one.
              </p>
            </div>
            <Button variant="secondary" className="mt-3" asChild>
              <Link href={`/${org}/ideas/new_idea`}>Create new idea</Link>
            </Button>
          </div>
        ) : (
          ideas?.data.ideas.map((idea, index) => {
            const isLastItem = index === ideas.data.ideas.length - 1;
            return (
              <>
                <IdeaCard idea={idea} org={org} key={idea.id} />
                {!isLastItem && <Separator />}
              </>
            );
          })
        )}
      </Card>
    </>
  );
};

export default Ideas;
