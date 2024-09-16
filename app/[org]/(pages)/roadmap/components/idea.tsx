'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronUp, LoaderCircle } from 'lucide-react';

import { Toggle } from '@fucina/ui';
import { IdeaType } from '@/types/idea';
import { useVoteIdea } from '@/app/api/controllers/ideaController';

interface IProps {
  idea: IdeaType;
  org: string;
}

const IdeaCard = ({ idea, org }: IProps) => {
  const router = useRouter();
  const handleClickIdea = (id: string) => {
    router.push(`/${org}/roadmap/${id}`);
  };

  const { mutate: voteIdea, isLoading: isLoadingVoteIdea } = useVoteIdea();

  const handleVoteIdea = (id: string, isVoted: boolean) => {
    voteIdea({ id, isVoted: !isVoted });
  };

  return (
    <div
      key={idea.id}
      onClick={() => handleClickIdea(idea.id)}
      className="flex gap-4 hover:bg-item-hover active:bg-item-selected p-4 rounded w-full cursor-pointer"
    >
      <div className="flex flex-col gap-2 w-full">
        <h1 className="line-clamp-3 text-lg-semibold">{idea.title}</h1>
        <p className="text-description text-md">{idea.topic.name}</p>
      </div>
      <Toggle
        aria-label="vote"
        className="flex flex-col justify-items-center items-center gap-0 space-y-0 p-1 w-11 h-14"
        pressed={idea.isVoted}
        onClick={(ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          handleVoteIdea(idea.id, idea.isVoted);
        }}
      >
        <ChevronUp size={24} />
        {isLoadingVoteIdea ? (
          <div className="flex justify-center items-center w-full h-[22px]">
            <LoaderCircle
              size={16}
              className="animate-spin stroke-icon-brand"
            />
          </div>
        ) : (
          <p className="text-md">{idea.voters.length}</p>
        )}
      </Toggle>
    </div>
  );
};

export default IdeaCard;