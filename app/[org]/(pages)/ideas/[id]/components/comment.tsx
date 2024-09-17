import React, { useCallback, useState } from "react";
import { LoaderCircle } from "lucide-react";

import {
  Textarea,
  Separator,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@fucina/ui";
import { CommentType } from "@/types/comment";
import {
  useReplyComment,
  useVoteComment,
} from "@/app/api/controllers/commentController";

export type OptimisticComment = {
  id: string | null;
  text: string;
  author: {
    id: string;
    name: string | null;
    image_url: string | null;
  };
  created_at: Date;
};

interface IProps {
  comment: CommentType | OptimisticComment;
}

const CommentCard = ({ comment }: IProps) => {
  const isOptimisticComment = !("childComments" in comment);
  const { mutate: voteComment } = useVoteComment();
  const handleClickVoteComment = () => {
    if (isOptimisticComment) return;
    voteComment({
      id: comment.id,
      isVoted: !comment.isVoted,
      ideaId: comment.ideaId,
    });
  };

  const [showReplySection, setShowReplySection] = useState(false);

  const [reply, setReply] = useState<string>("");

  const { mutateAsync: createCommentAsync, isLoading: isLoadingCreateComment } =
    useReplyComment();

  const handleComment = async () => {
    if (isOptimisticComment) return;
    try {
      await createCommentAsync({
        ideaId: comment.ideaId,
        reply: reply,
        id: comment.id,
      });
      setReply("");
    } catch (e) {}
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-start gap-4">
        <Avatar size="md" className="border-default border">
          <AvatarImage
            src={comment.author.image_url ?? undefined}
            alt={comment.author.name ?? undefined}
          />
          <AvatarFallback>
            {comment.author.name ? comment.author.name[0] : undefined}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between items-center gap-1">
            <p className="text-md-medium">{comment.author.name}</p>
            <p className="text-description text-sm">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
          <p className="text-description text-md">{comment.text}</p>
          <div className="flex gap-4 mt-1 text-description text-md-medium">
            <div
              className={`flex gap-4 items-center ${
                isOptimisticComment ? "opacity-50" : ""
              }`}
            >
              <span
                className={
                  isOptimisticComment ? "cursor-default" : "cursor-pointer"
                }
                onClick={() => {
                  if (!isOptimisticComment) handleClickVoteComment();
                }}
              >
                {!isOptimisticComment && comment.isVoted
                  ? "Downvote"
                  : "Upvote"}
                {` (${!isOptimisticComment ? comment.votes.length : 0})`}
              </span>
              <span
                className={
                  isOptimisticComment ? "cursor-default" : "cursor-pointer"
                }
                onClick={() => {
                  if (!isOptimisticComment)
                    setShowReplySection((prev) => !prev);
                }}
              >
                Reply
              </span>
            </div>
          </div>
        </div>
      </div>
      {showReplySection && (
        <div className="flex flex-col gap-2 mt-2 ml-[52px]">
          <Separator />
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-start gap-3">
              <Avatar size="md" className="border-default border">
                <AvatarImage
                  src={comment.author.image_url ?? undefined}
                  alt={comment.author.name ?? undefined}
                />
                <AvatarFallback>
                  {comment.author.name ? comment.author.name[0] : undefined}
                </AvatarFallback>
              </Avatar>
              <Textarea
                placeholder={`Reply to ${comment.author.name}`}
                value={reply}
                onChange={(ev) => setReply(ev.target.value)}
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
        </div>
      )}
      <div className="flex flex-col gap-4 mt-4 pl-[52px]">
        {!isOptimisticComment &&
          comment.childComments.map((childComment) => {
            return (
              <div
                key={childComment.id}
                className="flex justify-center items-start gap-4"
              >
                <Avatar size="md" className="border-default border">
                  <AvatarImage
                    src={childComment.author.image_url ?? undefined}
                    alt={childComment.author.name ?? undefined}
                  />
                  <AvatarFallback>
                    {childComment.author.name
                      ? childComment.author.name[0]
                      : undefined}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-center gap-1">
                    <p className="text-md-medium">{childComment.author.name}</p>
                    <p className="text-description text-sm">
                      {new Date(childComment.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-description text-md">
                    {childComment.text}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentCard;
