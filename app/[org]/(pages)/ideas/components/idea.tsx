'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronUp, Dot, MessageSquare } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Toggle,
} from '@fucina/ui';
import { useVoteIdea } from '@/app/api/controllers/ideaController';
import { StatusTagIdea } from '@/utils/parseStatus';
import { IdeaType } from '@/types/idea';
import useOpenUserTab from '@/utils/useOpenUserTab';
import { useOptimistic } from '@/utils/useOptimistic';
import { useAuth } from '@/context/authContext';
import { cn, focusRing } from '@fucina/utils';

interface IProps {
  idea: IdeaType;
  org: string;
  profile?: boolean;
}

const IdeaCard = ({ profile, idea, org }: IProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const handleClickIdea = (id: string) => {
    router.push(`/${org}/ideas/${id}`);
  };

  const { mutate: voteIdea } = useVoteIdea();

  const handleVoteIdea = (isVoted: boolean) => {
    voteIdea({ id: idea.id, isVoted: isVoted });
  };
  const userPageLink = useOpenUserTab({ userId: idea.authorId });

  const [isVoted, setIsVoted] = useOptimistic({
    mainState: idea.isVoted,
    callOnChange: handleVoteIdea,
  });

  const votedCountWithoutUser = useMemo(() => {
    return idea.voters.filter((voter) => voter.userId !== user?.id).length;
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
      <Avatar size="xl" className="sm:flex hidden mt-1">
        <AvatarImage
          src={idea.author.image_url ?? undefined}
          alt={idea.author.name ?? undefined}
        />
        <AvatarFallback>
          {idea.author.name ? idea.author.name[0] : undefined}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col space-y-1 pr-4 w-full">
        <div className="flex justify-between items-center">
          <h1 className="line-clamp-1 pr-2 text-lg-semibold">{idea.title}</h1>
          {idea.status && <StatusTagIdea status={idea.status.name} />}
        </div>
        <p className="line-clamp-1 text-description text-md">
          {idea.description}
        </p>
        <div className="flex justify-start items-center gap-0 pt-1 text-description text-sm">
          {!profile && (
            <>
              <p
                className="flex items-center gap-1"
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                }}
              >
                by{' '}
                <Link
                  className={cn(
                    'flex sm:hidden text-brand text-sm-medium hover:text-brand-hover active:text-brand-active underline underline-offset-4',
                    focusRing
                  )}
                  href={userPageLink}
                >
                  {idea.author.name}
                </Link>
                <HoverCard>
                  <HoverCardTrigger asChild className="sm:flex hidden">
                    <Link
                      className="text-brand text-sm-medium hover:text-brand-hover active:text-brand-active underline underline-offset-4"
                      href={userPageLink}
                    >
                      {idea.author.name}
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-fit">
                    <div className="flex items-center gap-2">
                      <Avatar size="xl">
                        <AvatarImage
                          src={idea?.author.image_url ?? undefined}
                          alt={idea?.author.name ?? undefined}
                        />
                        <AvatarFallback>
                          {idea.author.name ? idea.author.name[0] : undefined}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5">
                        <p className="font-semibold text-md">
                          {idea.author.name}
                        </p>
                        <div className="flex justify-start items-center gap-0 w-fit text-description text-sm">
                          <p>🪬 {idea.author.email} karmas</p>
                          <Dot />
                          <p>🏅 7 badges</p>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </p>
              <Dot className="sm:flex hidden" />
            </>
          )}
          <p className="sm:flex hidden">{idea.topic.name}</p>
          <Dot className="md:flex hidden" />
          <p className="md:flex hidden">
            {new Date(idea.created_at).toLocaleDateString()}
          </p>
          <Dot className="sm:flex hidden" />
          <p className="sm:flex items-center gap-1 hidden">
            {idea.commentsCount} <MessageSquare size={16} />
          </p>
        </div>
      </div>
      <Toggle
        aria-label="vote"
        className="flex flex-col justify-items-center items-center gap-0 space-y-0 p-1 w-11 h-14"
        pressed={isVoted}
        onClick={(ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          setIsVoted(!isVoted);
        }}
      >
        <ChevronUp size={24} />
        <p className="text-md">{votedCountToShow}</p>
      </Toggle>
    </button>
  );
};

export default IdeaCard;
