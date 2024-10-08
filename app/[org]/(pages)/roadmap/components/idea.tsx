'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronUp } from 'lucide-react';

import { Toggle } from '@fucina/ui';
import { IdeaType } from '@/types/idea';
import { useVoteIdea } from '@/app/api/controllers/ideaController';
import { useOptimistic } from '@/utils/useOptimistic';
import { useAuth } from '@/context/authContext';
import { cn, focusRing } from '@fucina/utils';
import { ConfettiButton } from '@/components/confetti';

interface IProps {
  idea: IdeaType;
  org: string;
}

const IdeaCard = ({ idea, org }: IProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const handleClickIdea = (id: string) => {
    router.push(`/${org}/roadmap/${id}`);
  };

  const { mutate: voteIdea } = useVoteIdea();

  const handleVoteIdea = (isVoted: boolean) => {
    voteIdea({ id: idea.id, isVoted: isVoted });
  };

  const [isVoted, setIsVoted] = useOptimistic({
    mainState: idea.isVoted,
    callOnChange: handleVoteIdea,
  });

  const votedCountWithoutUser = useMemo(() => {
    return (
      idea?.voters.filter((voter) => voter.userId !== user?.id).length ?? 0
    );
  }, [idea]);

  const votedCountToShow = useMemo(() => {
    return isVoted ? votedCountWithoutUser + 1 : votedCountWithoutUser;
  }, [isVoted, votedCountWithoutUser]);

  return (
    <button
      key={idea.id}
      className={cn(
        'flex gap-3 hover:bg-item-active active:bg-item-selected p-4 text-left rounded-md w-full cursor-pointer',
        focusRing
      )}
      onClick={() => handleClickIdea(idea.id)}
    >
      <div className="flex flex-col gap-2 w-full">
        <h1 className="line-clamp-3 text-lg-semibold">{idea.title}</h1>
        <p className="text-description text-md">{idea.topic.name}</p>
      </div>
      <ConfettiButton pressed={isVoted} setIsVoted={() => setIsVoted(!isVoted)}>
        <ChevronUp size={24} />
        <p className="text-md">{votedCountToShow}</p>
      </ConfettiButton>
    </button>
  );
};

export default IdeaCard;
