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
import IdeasEmpty from '@/components/org/ideas-empty';

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
        <Loading className="min-h-[40vh] size-full" />
      ) : ideas.length === 0 ? (
        <IdeasEmpty
          title="No ideas found"
          description="Be brave. Leave the first one."
          button={
            <Button variant="secondary" className="mt-3" asChild>
              <Link href={`/${org}/roadmap/new_idea`}>New idea</Link>
            </Button>
          }
        />
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
