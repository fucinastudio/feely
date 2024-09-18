import { useMutation, useQueryClient } from "react-query";

import client, { FeelyRequest } from "@/app/api/apiClient";
import {
  IReplyComment,
  IVoteComment,
} from "@/app/api/apiServerActions/commentApiServerAction";
import { Endpoints } from "@/app/api/endpoints";
import { CommentType } from "@/types/comment";

export interface ICreateComment {
  ideaId: string;
  comment: string;
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const createCommentFunction = async (createComment: ICreateComment) => {
    const req: FeelyRequest = {
      url: Endpoints.comment.main,
      config: {
        method: "POST",
        data: JSON.stringify({ data: createComment }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; id: string | null } },
    null,
    ICreateComment
  >(createCommentFunction, {
    onSettled: () => {
      queryClient.invalidateQueries([Endpoints.idea.main]);
    },
  });
};

interface IVoteCommentForInvalidation extends IVoteComment {
  ideaId: string;
}

export const useVoteComment = () => {
  const queryClient = useQueryClient();
  const voteIdeaFunction = async (voteIdea: IVoteCommentForInvalidation) => {
    const req: FeelyRequest = {
      url: Endpoints.comment.vote,
      config: {
        method: "POST",
        data: JSON.stringify({
          data: {
            id: voteIdea.id,
            isVoted: voteIdea.isVoted,
          },
        }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string } },
    null,
    IVoteCommentForInvalidation
  >(voteIdeaFunction, {
    onSettled: (_a, _b, variables) => {
      queryClient.invalidateQueries([Endpoints.idea.workspace.main]);
      queryClient.invalidateQueries([Endpoints.idea.main, variables.ideaId]);
    },
  });
};

export const useReplyComment = () => {
  const queryClient = useQueryClient();
  const voteIdeaFunction = async (commentIdea: IReplyComment) => {
    const req: FeelyRequest = {
      url: Endpoints.comment.reply,
      config: {
        method: "POST",
        data: JSON.stringify({
          data: commentIdea,
        }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; id: string | null } },
    null,
    IReplyComment
  >(voteIdeaFunction, {
    onSettled: (_a, _b, variables) => {
      queryClient.invalidateQueries([Endpoints.idea.workspace.main]);
      queryClient.invalidateQueries([Endpoints.idea.main, variables.ideaId]);
    },
  });
};
