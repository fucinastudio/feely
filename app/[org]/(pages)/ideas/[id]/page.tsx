'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronUp, Dot, Inbox } from 'lucide-react';

import {
  Button,
  Sheet,
  SheetContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
  Toggle,
  Separator,
  Textarea,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  SelectGroupLabel,
  SelectGroup,
} from '@fucina/ui';
import {
  useGetIdeaById,
  usePatchIdea,
  useVoteIdea,
} from '@/app/api/controllers/ideaController';
import { useCreateComment } from '@/app/api/controllers/commentController';
import CommentCard, {
  OptimisticComment,
} from '@/app/[org]/(pages)/ideas/[id]/components/comment';
import { useAuth } from '@/context/authContext';
import { useWorkspace } from '@/context/workspaceContext';
import Loading from '@/app/loading';
import { useOptimistic } from '@/utils/useOptimistic';
import useOpenUserTab from '@/utils/useOpenUserTab';
import { CommentType } from '@/types/comment';

export interface IPropsIdeaPage {
  params: {
    org: string;
    id: string;
  };
}

const IdeaPage = (props: IPropsIdeaPage) => {
  const {
    params: { id },
  } = props;
  const router = useRouter();
  const pathName = usePathname();

  const handleClose = () => {
    router.push(pathName?.substring(0, pathName?.lastIndexOf('/')) ?? '/');
  };
  const { data: ideaData, isLoading: isLoadingGetIdea } = useGetIdeaById({
    id,
  });
  const idea = useMemo(() => {
    return ideaData?.data.idea;
  }, [ideaData]);

  const [comment, setComment] = useState<string>('');

  const { mutateAsync: createComment, isLoading: isLoadingCreateComment } =
    useCreateComment();

  const { user, isAdmin } = useAuth();

  const { statuses } = useWorkspace();

  const [createdComment, setCreatedComment] =
    useState<OptimisticComment | null>(null);

  const handleComment = async () => {
    try {
      if (user) {
        setCreatedComment({
          id: null,
          text: comment,
          author: {
            id: user.id,
            name: user.name,
            image_url: user.image_url,
          },
          created_at: new Date(),
        });
      }
      const content = comment;
      setComment('');
      const res = await createComment({
        ideaId: id,
        comment: content,
      });
      if (res.data.id) {
        setCreatedComment((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            id: res.data.id,
          };
        });
      }
    } catch (e) {}
  };

  //Remove the one we set optimistically
  const comments: (OptimisticComment | CommentType)[] = useMemo(() => {
    const isNewContained = idea?.comments.some(
      (comment) => comment.id === createdComment?.id
    );
    if (isNewContained) {
      return idea?.comments ?? [];
    }

    let newComments: any[] =
      idea?.comments.filter((comment) => comment.id !== createdComment?.id) ??
      [];
    if (createdComment) {
      newComments = [createdComment, ...newComments];
    }
    return newComments;
  }, [idea, createdComment]);

  const { mutate: voteIdea, isLoading: isLoadingVoteIdea } = useVoteIdea();

  const handleVoteIdea = (isVoted: boolean) => {
    voteIdea({ id, isVoted: isVoted });
  };

  const { mutate: patchIdea } = usePatchIdea();

  const handleChangeStatus = (statusId: string) => {
    if (!idea) return;
    patchIdea({
      ideaId: idea?.id,
      statusId: statusId,
    });
  };

  const userPageLink = useOpenUserTab({ userId: idea?.authorId ?? '' });

  const [isVoted, setIsVoted] = useOptimistic({
    mainState: idea?.isVoted ?? false,
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
    <div>
      <Sheet
        open={true}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        {isLoadingGetIdea ? (
          <SheetContent>
            <Loading className="size-full" />
          </SheetContent>
        ) : idea ? (
          <SheetContent>
            <SheetHeader>
              <div className="flex sm:flex-row flex-col justify-start items-start gap-3 sm:gap-4">
                <Toggle
                  aria-label="vote"
                  className="flex flex-col justify-items-center items-center gap-0 space-y-0 p-1 w-11 min-w-11 h-14"
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
                <div className="flex flex-col gap-1">
                  <SheetTitle>{idea?.title}</SheetTitle>
                  <SheetDescription>{idea?.description}</SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4 w-full overflow-auto">
              <div className="flex flex-col gap-3 sm:gap-1.5 px-0.5 sm:px-0 w-full">
                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-1 sm:gap-4 w-full sm:h-9">
                  <p className="px-3 sm:px-0 min-w-20 text-description text-md">
                    Author
                  </p>
                  <Button variant="link" asChild className="flex sm:hidden">
                    <Link
                      href={userPageLink}
                      className="flex items-center gap-2"
                    >
                      <Avatar size="sm">
                        <AvatarImage
                          src={idea.author.image_url ?? undefined}
                          alt={idea.author.name ?? undefined}
                        />
                        <AvatarFallback>
                          {idea.author.name ? idea.author.name[0] : undefined}
                        </AvatarFallback>
                      </Avatar>
                      {idea.author.name}
                    </Link>
                  </Button>
                  <HoverCard>
                    <HoverCardTrigger asChild className="sm:flex hidden">
                      <Button variant="link" asChild>
                        <Link
                          href={userPageLink}
                          className="flex items-center gap-2"
                        >
                          <Avatar size="sm">
                            <AvatarImage
                              src={idea.author.image_url ?? undefined}
                              alt={idea.author.name ?? undefined}
                            />
                            <AvatarFallback>
                              {idea.author.name
                                ? idea.author.name[0]
                                : undefined}
                            </AvatarFallback>
                          </Avatar>
                          {idea.author.name}
                        </Link>
                      </Button>
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
                </div>
                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-1 sm:gap-4 w-full sm:h-9">
                  <p className="px-3 sm:px-0 min-w-20 text-description text-md">
                    Status
                  </p>
                  {isAdmin ? (
                    <Select
                      defaultValue={idea.statusId ?? undefined}
                      onValueChange={(ev) => handleChangeStatus(ev)}
                    >
                      <SelectTrigger className="hover:bg-item-active active:bg-item-selected shadow-none border-none rounded w-36 h-9 font-medium">
                        <SelectValue placeholder="Chose one topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectGroupLabel>Status</SelectGroupLabel>
                          {statuses?.map((status) => {
                            return (
                              <SelectItem key={status.id} value={status.id}>
                                {status.name}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : idea.status ? (
                    <div className="flex items-center px-3 py-1 h-9">
                      <p className="font-medium text-md">{idea.status.name}</p>
                    </div>
                  ) : null}
                </div>
                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-1 sm:gap-4 w-full sm:h-9">
                  <p className="px-3 sm:px-0 min-w-20 text-description text-md">
                    Topic
                  </p>
                  <div className="flex items-center px-3 py-1 h-9">
                    <p className="font-medium text-md">{idea.topic.name}</p>
                  </div>
                </div>
                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-1 sm:gap-4 w-full sm:h-9">
                  <p className="px-3 sm:px-0 min-w-20 text-description text-md">
                    Created
                  </p>
                  <div className="flex items-center px-3 py-1 h-9">
                    <p className="font-medium text-md">
                      {new Date(idea.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-row flex-col items-start sm:items-center gap-1 sm:gap-4 w-full sm:h-9">
                  <p className="px-3 sm:px-0 min-w-20 text-description text-md">
                    Voters
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="text">
                        <span className="flex justify-start items-center gap-2">
                          {idea.voters.length === 0 ? (
                            '0 Voters'
                          ) : (
                            <>
                              <div className="flex justify-start items-center -space-x-1.5">
                                {idea.voters.slice(0, 5).map((voter, index) => (
                                  <Avatar key={index} size="sm">
                                    <AvatarImage
                                      src={voter.user.image_url ?? undefined}
                                      alt={voter.user.name ?? undefined}
                                    />
                                    <AvatarFallback>
                                      {voter.user.name
                                        ? voter.user.name[0]
                                        : undefined}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              {idea.voters.length > 5 && (
                                <span>+ {idea.voters.length - 5} Voters</span>
                              )}
                            </>
                          )}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Voters</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {idea.voters.length === 0 ? (
                          <DropdownMenuItem>0 Voters</DropdownMenuItem>
                        ) : (
                          idea.voters.map((voter, index) => (
                            <Link key={index} href={userPageLink}>
                              <DropdownMenuItem className="flex items-center gap-2 w-full h-9">
                                <Avatar size="sm">
                                  <AvatarImage
                                    src={voter.user.image_url ?? undefined}
                                    alt={voter.user.name ?? undefined}
                                  />
                                  <AvatarFallback>
                                    {voter.user.name
                                      ? voter.user.name[0]
                                      : undefined}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{voter.user.name}</span>
                              </DropdownMenuItem>
                            </Link>
                          ))
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-start gap-2 px-1">
                  <Avatar size="md" className="sm:flex hidden mt-0.5">
                    <AvatarImage
                      src={user?.image_url ?? undefined}
                      alt={user?.name ?? undefined}
                    />
                    <AvatarFallback>
                      {user?.name ? user?.name[0] : undefined}
                    </AvatarFallback>
                  </Avatar>
                  <Textarea
                    placeholder={`Reply to ${idea.author.name}`}
                    value={comment}
                    onChange={(ev) => setComment(ev.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end items-center px-1 w-full">
                  <Button
                    disabled={!comment}
                    isLoading={isLoadingCreateComment}
                    loadingText="Wait a sec..."
                    onClick={() => {
                      if (!isLoadingCreateComment) handleComment();
                    }}
                    className="w-fit"
                  >
                    Comment
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-4 px-1 w-full">
                <p className="text-description text-heading-group">Replies</p>
                {comments?.map((comment, index) => {
                  return (
                    <CommentCard
                      key={comment.id ?? `New_comment-${index}`}
                      comment={comment}
                    />
                  );
                })}
              </div>
            </div>
          </SheetContent>
        ) : (
          <SheetContent>
            <div className="flex flex-col justify-center items-center gap-3 p-10 w-full h-full text-description">
              <Inbox className="size-8 stroke-icon" />
              <div className="flex flex-col gap-1 w-full">
                <h3 className="font-semibold text-center text-lg">
                  Idea not found
                </h3>
                <p className="text-center">
                  This idea does not exist or you do not have access to it.
                </p>
              </div>
              <Button variant="secondary" className="mt-3" asChild>
                <Link href="/">Back to the homepage</Link>
              </Button>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
};

export default IdeaPage;
