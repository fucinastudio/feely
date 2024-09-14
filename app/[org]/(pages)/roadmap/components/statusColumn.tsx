import React from 'react';
import { useRouter } from 'next/navigation';
import { Inbox, Plus } from 'lucide-react';

import { Button, Separator } from '@fucina/ui';
import IdeaCard from '@/app/[org]/(pages)/roadmap/components/idea';
import Loading from '@/app/[org]/(pages)/settings/loading';
import { IdeaType } from '@/types/idea';
import { StatusTag } from '@/utils/parseStatus';
import { useWorkspace } from '@/context/workspaceContext';

interface IProps {
  status: string;
  ideas: IdeaType[] | null;
}

const StatusColumn = ({ status, ideas }: IProps) => {
  const { org } = useWorkspace();

  const router = useRouter();

  const handleAddIdea = () => {
    //Here we should probably pass a reference to the status and use that as initial one
    router.push(`/${org}/roadmap/new_idea`);
  };

  return (
    <div className="flex flex-col space-y-1 border-default bg-background p-1 border rounded-lg w-full h-fit">
      <div className="flex items-center border-default pt-1 pr-1 pb-2 pl-2 border-b h-12">
        <StatusTag status={status} />
      </div>
      {!ideas ? (
        <Loading />
      ) : ideas.length === 0 ? (
        <>
          <div className="flex flex-col justify-center items-center gap-3 p-10 w-full">
            <Inbox size={40} className="stroke-icon" />
            <div className="flex flex-col gap-2 w-full text-center">
              <h4 className="text-heading-body">No ideas found</h4>
              <p className="text-description text-md">
                Starting to share is difficult. But you could start by setting a
                good example.
              </p>
            </div>
          </div>

          <Separator />
          <Button variant="text" className="w-full" onClick={handleAddIdea}>
            <Plus />
            Add idea
          </Button>
        </>
      ) : (
        <>
          {ideas.map((idea) => {
            return <IdeaCard idea={idea} org={org} key={idea.id} />;
          })}
        </>
      )}
    </div>
  );
};

export default StatusColumn;
