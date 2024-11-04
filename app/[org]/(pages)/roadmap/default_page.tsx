"use client";

import React, { useMemo } from "react";

import { useWorkspace } from "@/context/workspaceContext";
import useMainPageFilters from "@/components/filters/filters";
import FiltersComponentObject from "@/components/filters/filtersComponent";
import StatusColumn from "@/app/[org]/(pages)/roadmap/components/statusColumn";
import { useGetIdeasByWorkspaceName } from "@/app/api/controllers/ideaController";
import { IdeaType } from "@/types/idea";
import { Skeleton } from "@fucina/ui";
import Loading from "@/app/loading";

export const allowedStatuses = ["Planned", "In progress", "Completed"];

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
    roadmapStatuses: true,
  });

  const { data: allIdeas } = useGetIdeasByWorkspaceName({
    workspaceName: org,
    orderBy: selectedOrder,
    topicId: selectedTopics.length === 0 ? undefined : selectedTopics,
    statusId: selectedStatuses.length === 0 ? undefined : selectedStatuses,
    title: mainSearchTitle,
  });

  const statusesToRender = useMemo(() => {
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
    return <Loading className="min-h-[60vh] size-full" />;
  }

  return (
    <>
      <FiltersComponentObject {...filterObjectAttributes} />
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3 w-full">
        {!statusesToRender || !statuses ? (
          <>
            <Skeleton className="w-full min-h-[60vh]" />
            <Skeleton className="w-full min-h-[60vh]" />
            <Skeleton className="w-full min-h-[60vh]" />
          </>
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
    </>
  );
};

export default RoadmapPage;
