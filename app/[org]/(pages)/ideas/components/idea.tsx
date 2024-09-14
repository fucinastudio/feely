'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronUp, Dot, LoaderCircle, MessageSquare } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage, Toggle } from '@fucina/ui';
import { useVoteIdea } from '@/app/api/controllers/ideaController';
import { StatusTag } from '@/utils/parseStatus';
import { IdeaType } from '@/types/idea';

interface IProps {
  idea: IdeaType;
  org: string;
}

const IdeaCard = ({ idea, org }: IProps) => {
  const router = useRouter();
  const handleClickIdea = (id: string) => {
    router.push(`/${org}/ideas/${id}`);
  };

  const { mutate: voteIdea, isLoading: isLoadingVoteIdea } = useVoteIdea();

  const handleVoteIdea = (id: string, isVoted: boolean) => {
    voteIdea({ id, isVoted: !isVoted });
  };
  const userLink = useMemo(() => {
    return `/${org}/ideas?user=${idea.authorId}`;
  }, [org, idea.authorId]);
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
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
            }}
          >
            by{' '}
            <Link
              className="text-brand text-sm-medium hover:text-brand-hover active:text-brand-active underline underline-offset-4"
              href={userLink}
            >
              {idea.author.name}
            </Link>
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
