import { Prisma } from "@prisma/client";

export type ICommentSelectionObject = {
  include: {
    childComments: {
      include: {
        author: true;
        votes: true;
      };
    };
    votes: true;
    author: true;
  };
  select: {
    id: true;
    childComments: {
      select: {
        id: true;
        text: true;
        author: true;
        authorId: true;
        created_at: true;
        votes: true;
        ideaId: true;
      };
    };
    votes: true;
    text: true;
    author: true;
    created_at: true;
  };
};

export type CommentType = Prisma.commentGetPayload<ICommentSelectionObject> & {
  isVoted: boolean;
};
