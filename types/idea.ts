import { Prisma } from '@prisma/client';

import { CommentType } from '@/types/comment';

export type IIdeaSelectionObject = {
  include: {
    author: true;
    status: true;
    topic: true;
    voters: {
      select: {
        userId: true;
      };
      include: {
        user: {
          select: {
            id: true;
            image_url: true;
            name: true;
            email: true;
          };
        };
      };
    };
  };
};

export type IdeaType = Prisma.ideaGetPayload<IIdeaSelectionObject> & {
  isVoted: boolean;
  commentsCount: number;
};

export type IdeaWithCommentsType =
  Prisma.ideaGetPayload<IIdeaSelectionObject> & {
    isVoted: boolean;
    comments: CommentType[];
  };
