'use client';

import React from 'react';
import Link from 'next/link';

import { Button, Separator } from '@fucina/ui';
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
    return <div className="bg-red-600 size-8">Loading</div>;
  }
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-heading-section">Ideas</h2>
        <Button asChild>
          <Link href={`/${org}/ideas/new_idea`}>New idea</Link>
        </Button>
      </div>
      <Separator />
      {/*Filters */}
      <FiltersComponentObject {...filterObjectAttributes} />
      <div className="flex flex-col space-y-1 border-default bg-background p-1 border rounded-lg w-full min-h-64">
        {!statuses || !topics || isLoadingIdeas ? (
          <Loading />
        ) : (
          ideas?.data.ideas.map((idea, index) => {
            const isLastItem = index === ideas.data.ideas.length - 1;
            return (
              <>
                <IdeaCard idea={idea} org={org} key={index} />
                {!isLastItem && <Separator />}
              </>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Ideas;
