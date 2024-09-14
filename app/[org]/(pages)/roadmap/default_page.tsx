'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';

import { Button, Separator } from '@fucina/ui';
import { useWorkspace } from '@/context/workspaceContext';
import useMainPageFilters from '@/components/filters/filters';
import FiltersComponentObject from '@/components/filters/filtersComponent';
import StatusColumn from '@/app/[org]/(pages)/roadmap/components/statusColumn';
import { useGetIdeasByWorkspaceName } from '@/app/api/controllers/ideaController';
import { IdeaType } from '@/types/idea';

const RoadmapPage = () => {
  const { org, workspace, statuses, topics } = useWorkspace();

  const {
    filterObjectAttributes,
    mainSearchTitle,
    selectedOrder,
    selectedStatuses,
    selectedTopics,
  } = useMainPageFilters({
    topics: topics ?? [],
    statuses: statuses ?? [],
  });

  const { data: allIdeas } = useGetIdeasByWorkspaceName({
    workspaceName: org,
    orderBy: selectedOrder,
    topicId: selectedTopics.length === 0 ? undefined : selectedTopics,
    statusId: selectedStatuses.length === 0 ? undefined : selectedStatuses,
    title: mainSearchTitle,
  });

  const statusesToRender = useMemo(() => {
    const allowedStatuses = ['Planned', 'In progress', 'Completed'];
    const filteredStatuses = statuses?.filter((status) =>
      allowedStatuses.includes(status.name)
    );

    if (!selectedStatuses || selectedStatuses.length === 0)
      return filteredStatuses;

    return filteredStatuses?.filter((status) =>
      selectedStatuses.includes(status.id)
    );
  }, [selectedStatuses, statuses]);

  if (!workspace || !workspace.workspaceSettings?.showRoadmap) {
    return <div className="bg-red-600 size-8">Loading</div>;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-heading-section">Roadmap</h2>
        <Button asChild>
          <Link href={`/${org}/roadmap/new_idea`}>New idea</Link>
        </Button>
      </div>
      <Separator />
      <FiltersComponentObject {...filterObjectAttributes} />
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3 w-full">
        {!statusesToRender || !statuses ? (
          <div className="bg-green-600 size-10">Loading</div>
        ) : (
          statusesToRender.map((status) => {
            let ideas: IdeaType[] | null = null;
            if (allIdeas?.data.ideas) {
              ideas = allIdeas.data.ideas.filter(
                (idea) => idea.status?.id === status.id
              );
            }
            return (
              <StatusColumn
                status={status.name}
                ideas={ideas}
                key={status.id}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
