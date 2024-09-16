"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronUp, LoaderCircle } from "lucide-react";

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
  ScrollArea,
  Textarea,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@fucina/ui";
import {
  useGetIdeaById,
  usePatchIdea,
  useVoteIdea,
} from "@/app/api/controllers/ideaController";
import { useCreateComment } from "@/app/api/controllers/commentController";
import CommentCard from "@/app/[org]/(pages)/ideas/[id]/components/comment";
import { useAuth } from "@/context/authContext";
import { useWorkspace } from "@/context/workspaceContext";
import Loading from "@/app/[org]/(pages)/ideas/[id]/loading";
import { useOptimistic } from "@/utils/useOptimistic";

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
    router.push(pathName.substring(0, pathName.lastIndexOf("/")));
  };
  const { data: ideaData, isLoading: isLoadingGetIdea } = useGetIdeaById({
    id,
  });
  const idea = ideaData?.data.idea;

  const [comment, setComment] = useState<string>("");

  const { mutateAsync: createComment, isLoading: isLoadingCreateComment } =
    useCreateComment();

  const { user, isAdmin } = useAuth();

  const { statuses } = useWorkspace();

  const handleComment = async () => {
    try {
      await createComment({
        ideaId: id,
        comment,
      });
      setComment("");
    } catch (e) {}
  };

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
          <SheetContent className="p-10 w-2/5 min-w-[40%] max-w-[40%]">
            <Loading />
          </SheetContent>
        ) : idea ? (
          <SheetContent className="flex p-0 w-2/5 min-w-[40%] max-w-[40%]">
            <ScrollArea className="size-full">
              <div className="flex flex-col gap-6 p-10 w-full overflow-auto">
                <div className="flex gap-4 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <h2 className="text-heading-body">{idea?.title}</h2>
                    <p className="text-description text-md">
                      {idea?.description}
                    </p>
                  </div>
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
                    {/* {isLoadingVoteIdea ? (
                      <LoaderCircle className="animate-spin stroke-icon" />
                    ) : ( */}
                    <p className="text-md">{votedCountToShow}</p>
                    {/* )} */}
                  </Toggle>
                </div>
                <Separator />
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-4 h-9">
                    <p className="min-w-20 text-description text-md">Author</p>
                    <Button variant="link">
                      <Link href="" className="flex items-center gap-2">
                        <Avatar size="sm" className="border-default border">
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
                  </div>
                  <div className="flex items-center gap-4 h-9">
                    <p className="min-w-20 text-description text-md">Status</p>
                    {isAdmin ? (
                      <Select
                        defaultValue={idea.statusId ?? undefined}
                        onValueChange={(ev) => handleChangeStatus(ev)}
                      >
                        <SelectTrigger className="hover:bg-item-hover active:bg-item-selected border-none rounded h-9">
                          <SelectValue placeholder="Chose one topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses?.map((status) => {
                            return (
                              <SelectItem key={status.id} value={status.id}>
                                {status.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    ) : idea.status ? (
                      <div className="flex items-center px-3 py-1 h-9">
                        <p className="text-md">{idea.status.name}</p>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-4 h-9">
                    <p className="min-w-20 text-description text-md">Topic</p>
                    <div className="flex items-center px-3 py-1 h-9">
                      <p className="text-md">{idea.topic.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 h-9">
                    <p className="min-w-20 text-description text-md">Created</p>
                    <div className="flex items-center px-3 py-1 h-9">
                      <p className="text-md">
                        {new Date(idea.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 h-9">
                    <p className="min-w-20 text-description text-md">Voters</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="text">
                          <span className="flex justify-start items-center gap-2">
                            {idea.voters.length === 0 ? (
                              "0 Voters"
                            ) : (
                              <>
                                <div className="flex justify-start items-center -space-x-1.5">
                                  {idea.voters
                                    .slice(0, 5)
                                    .map((voter, index) => (
                                      <Avatar key={index} size="sm">
                                        <AvatarImage
                                          src={
                                            voter.user.image_url ?? undefined
                                          }
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
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Voters</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {idea.voters.length === 0 ? (
                            <DropdownMenuItem>0 Voters</DropdownMenuItem>
                          ) : (
                            idea.voters.map((voter, index) => (
                              <DropdownMenuItem
                                key={index}
                                className="flex items-center gap-2 h-9"
                              >
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
                                {voter.user.name}
                              </DropdownMenuItem>
                            ))
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-start gap-3">
                    <Avatar size="md" className="border-default border">
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
                      className="border-none w-full"
                    />
                  </div>
                  <div className="flex justify-end items-center w-full">
                    <Button
                      disabled={!comment || isLoadingCreateComment}
                      onClick={() => {
                        if (!isLoadingCreateComment) handleComment();
                      }}
                      className="w-fit"
                    >
                      {isLoadingCreateComment ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Comment"
                      )}
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-4 w-full">
                  <p className="text-description text-heading-group">Replies</p>
                  {idea.comments?.map((comment) => {
                    return <CommentCard key={comment.id} comment={comment} />;
                  })}
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        ) : (
          <SheetContent className="p-10 w-2/5 max-w-[40%]">
            <p className="w-full text-center text-description text-md">
              Idea not found
            </p>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
};

export default IdeaPage;
