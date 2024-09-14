import React, { useCallback, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

import {
  Textarea,
  Separator,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@fucina/ui';
import { CommentType } from '@/types/comment';
import {
  useReplyComment,
  useVoteComment,
} from '@/app/api/controllers/commentController';

interface IProps {
  comment: CommentType;
}

const CommentCard = ({ comment }: IProps) => {
  const { mutate: voteComment } = useVoteComment();
  const handleClickVoteComment = useCallback(() => {
    voteComment({
      id: comment.id,
      isVoted: !comment.isVoted,
      ideaId: comment.ideaId,
    });
  }, [comment.id, comment.isVoted, comment.ideaId, voteComment]);

  const [showReplySection, setShowReplySection] = useState(false);

  const [reply, setReply] = useState<string>('');

  const { mutateAsync: createCommentAsync, isLoading: isLoadingCreateComment } =
    useReplyComment();

  const handleComment = async () => {
    try {
      await createCommentAsync({
        ideaId: comment.ideaId,
        reply: reply,
        id: comment.id,
      });
      setReply('');
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
            <span className="cursor-pointer" onClick={handleClickVoteComment}>
              {comment.isVoted ? 'Downvote' : 'Upvote'}
              {` (${comment.votes.length})`}
            </span>
            <span
              className="cursor-pointer"
              onClick={() => setShowReplySection((prev) => !prev)}
            >
              Reply
            </span>
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
                  'Comment'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 mt-4 pl-[52px]">
        {comment.childComments.map((childComment) => {
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
                <p className="text-description text-md">{childComment.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentCard;
