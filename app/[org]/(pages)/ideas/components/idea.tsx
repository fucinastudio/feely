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
import { StatusTag } from '@/utils/parseStatus';
import { IdeaType } from '@/types/idea';
import useOpenUserTab from '@/utils/useOpenUserTab';
import { useOptimistic } from '@/utils/useOptimistic';
import { useAuth } from '@/context/authContext';

interface IProps {
  idea: IdeaType;
  org: string;
}

const IdeaCard = ({ idea, org }: IProps) => {
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
    <div
      key={idea.id}
      className="flex gap-3 hover:bg-item-hover active:bg-item-selected p-4 rounded-md w-full cursor-pointer"
      onClick={() => handleClickIdea(idea.id)}
    >
      <Avatar size="xl" className="border-default mt-1 border">
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
          {idea.status && <StatusTag status={idea.status.name} />}
        </div>
        <p className="line-clamp-1 text-description text-md">
          {idea.description}
        </p>
        <div className="flex justify-start items-center gap-0 pt-1 text-description text-sm">
          <p
            className="flex items-center gap-0.5"
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
            }}
          >
            by{' '}
            <Link
              className="flex sm:hidden text-brand text-sm-medium hover:text-brand-hover active:text-brand-active underline underline-offset-4"
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
                  <Avatar size="xl" className="border-default border">
                    <AvatarImage
                      src={idea?.author.image_url ?? undefined}
                      alt={idea?.author.name ?? undefined}
                    />
                    <AvatarFallback>
                      {idea.author.name ? idea.author.name[0] : undefined}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-semibold text-md">{idea.author.name}</p>
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
          <Dot />
          <p>{idea.topic.name}</p>
          <Dot />
          <p>{new Date(idea.created_at).toLocaleDateString()}</p>
          <Dot />
          <p className="flex items-center gap-1">
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
    </div>
  );
};

export default IdeaCard;
