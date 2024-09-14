'use client';

import React from 'react';

import { Separator } from '@fucina/ui';
import EditTopicCard from '@/app/[org]/(pages)/settings/topics/components/editTopicCard';
import AddTopicCard from '@/app/[org]/(pages)/settings/topics/components/addTopicCard';
import { useWorkspace } from '@/context/workspaceContext';

export function Topics() {
  const { topics } = useWorkspace();
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-default bg-card border rounded-lg w-full">
        <div className="p-6 border-b border-b-default">
          <h2 className="text-heading-subsection">Topics</h2>
          <p className="text-description text-md">
            Add Topics so that users can tag them when creating Ideas.
          </p>
        </div>
        <div className="flex flex-col gap-6 p-6 w-full">
          <AddTopicCard />
          <Separator />
          <div className="flex flex-col gap-2 w-full">
            {topics?.map((topic, index) => {
              const isLast = topics.length === index + 1;
              return (
                <div key={topic.id} className="flex flex-col gap-2">
                  <EditTopicCard topic={topic} />
                  {!isLast && <Separator />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topics;
