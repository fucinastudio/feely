import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Inbox } from 'lucide-react';

import { Button, Separator } from '@fucina/ui';
import IdeaCard from '@/app/[org]/(pages)/roadmap/components/idea';
import Loading from '@/app/loading';
import { IdeaType } from '@/types/idea';
import { StatusTagColumn } from '@/utils/parseStatus';
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
        <StatusTagColumn status={status} />
      </div>
      {!ideas ? (
        <Loading className="w-full h-56" />
      ) : ideas.length === 0 ? (
        <>
          <div className="flex flex-col justify-center items-center gap-3 p-8 w-full text-description">
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
              <Link href={`/${org}/roadmap/new_idea`}>Create new idea</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          {ideas.map((idea, index) => {
            const isLastItem = index === ideas.length - 1;
            return (
              <>
                <IdeaCard idea={idea} org={org} key={idea.id} />{' '}
                {!isLastItem && <Separator />}
              </>
            );
          })}
        </>
      )}
    </div>
  );
};

export default StatusColumn;
