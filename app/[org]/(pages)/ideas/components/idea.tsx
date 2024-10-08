"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, MessageSquare, Dot } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@fucina/ui";
import { useVoteIdea } from "@/app/api/controllers/ideaController";
import { StatusTagIdea } from "@/utils/parseStatus";
import { IdeaType } from "@/types/idea";
import { useOptimistic } from "@/utils/useOptimistic";
import { useAuth } from "@/context/authContext";
import { cn, focusRing } from "@fucina/utils";
import UserProfileLinkComponent from "@/components/userProfileLinkComponent";
import HoverCardUser from "@/components/org/hover-card-user";
import { ConfettiButton } from "@/components/confetti";

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
        "flex gap-3 hover:bg-item-active active:bg-item-selected p-4 text-left rounded-md w-full cursor-pointer",
        focusRing
      )}
      onClick={() => handleClickIdea(idea.id)}
    >
      {!profile && (
        <Avatar size="xl" className="sm:flex hidden mt-1">
          <AvatarImage
            src={idea.author.image_url ?? undefined}
            alt={idea.author.name ?? undefined}
          />
          <AvatarFallback className="capitalize">
            {idea.author.name ? idea.author.name[0] : undefined}
          </AvatarFallback>
        </Avatar>
      )}
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
                by{" "}
                <UserProfileLinkComponent
                  className="flex sm:hidden text-brand text-sm-medium hover:text-brand-hover active:text-brand-active underline underline-offset-4"
                  userId={idea.authorId}
                >
                  {idea.author.name}
                </UserProfileLinkComponent>
                <HoverCardUser
                  trigger={
                    <UserProfileLinkComponent
                      className="text-brand text-sm-medium hover:text-brand-hover active:text-brand-active underline underline-offset-4"
                      userId={idea.authorId}
                    >
                      {idea.author.name}
                    </UserProfileLinkComponent>
                  }
                  imageSrc={idea?.author.image_url ?? undefined}
                  imageAlt={idea?.author.name ?? undefined}
                  imageFallback={
                    idea.author.name ? idea.author.name[0] : undefined
                  }
                  author={idea.author.name}
                  points={idea.author.userInWorkspace.at(0)?.points ?? null}
                />
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
      <ConfettiButton pressed={isVoted} setIsVoted={() => setIsVoted(!isVoted)}>
        <ChevronUp size={24} />
        <p className="text-md">{votedCountToShow}</p>
      </ConfettiButton>
    </button>
  );
};

export default IdeaCard;
