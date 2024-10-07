"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";
import { ICreateComment } from "@/app/api/controllers/commentController";
import prisma from "@/prisma/client";
import { getPointsToModify } from "@/utils/utils";

export const createComment = async (
  comment: ICreateComment,
  access_token?: string
) => {
  const supabase = createClient();
  const currentUser = await supabase.auth.getUser(access_token);
  if (!currentUser.data.user) {
    return {
      isSuccess: false,
      error: "Session not found",
    };
  }
  const user = await prisma.users.findFirst({
    where: {
      id: currentUser.data.user.id,
    },
  });
  if (!user) {
    return {
      isSuccess: false,
      error: "User not found",
    };
  }
  const newComment = await prisma.comment.create({
    data: {
      text: comment.comment,
      authorId: user.id,
      ideaId: comment.ideaId,
    },
    include: {
      idea: true,
    },
  });
  if (!newComment) {
    return {
      isSuccess: false,
      error: "Comment not created",
    };
  }

  const _createAssociation = await prisma.userInWorkspace.upsert({
    create: {
      userId: user.id,
      workspaceId: newComment.idea.workspaceId,
    },
    update: {},
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: newComment.idea.workspaceId,
      },
    },
    include: {
      workspace: {
        select: {
          name: true,
        },
      },
    },
  });
  revalidatePath(`/${_createAssociation.workspace.name}/community`);
  return {
    isSuccess: true,
    id: newComment.id,
  };
};

export interface IVoteComment {
  id: string;
  isVoted: boolean;
}

export const voteComment = async (
  body: IVoteComment,
  access_token?: string
) => {
  const supabase = createClient();
  const currentUser = await supabase.auth.getUser(access_token);
  if (!currentUser.data.user) {
    return {
      isSuccess: false,
      error: "Session not found",
    };
  }
  const user = await prisma.users.findFirst({
    where: {
      id: currentUser.data.user.id,
    },
  });
  if (!user) {
    return {
      isSuccess: false,
      error: "User not found",
    };
  }
  let response: {
    comment: {
      idea: {
        workspaceId: string;
        authorId: string;
      };
      authorId: string;
    };
    created_at: Date;
  };
  if (!body.isVoted) {
    response = await prisma.votedComment.delete({
      where: {
        commentId_userId: {
          userId: user.id,
          commentId: body.id,
        },
      },
      include: {
        comment: {
          include: {
            idea: true,
          },
        },
      },
    });
    if (response.comment.authorId && response.comment.authorId !== user.id) {
      const { applyToWeekly, applyToMonthly, applyToQuarterly, applyToYearly } =
        getPointsToModify(response.created_at);
      await prisma.userInWorkspace.update({
        where: {
          userId_workspaceId: {
            userId: response.comment.authorId,
            workspaceId: response.comment.idea.workspaceId,
          },
        },
        data: {
          points: {
            decrement: 1,
          },
          ...(applyToWeekly
            ? {
                pointsInWeek: {
                  decrement: 1,
                },
              }
            : {}),
          ...(applyToMonthly
            ? {
                pointsInMonth: {
                  decrement: 1,
                },
              }
            : {}),
          ...(applyToQuarterly
            ? {
                pointsInQuarter: {
                  decrement: 1,
                },
              }
            : {}),
          ...(applyToYearly
            ? {
                pointsInYear: {
                  decrement: 1,
                },
              }
            : {}),
        },
      });
    }
  } else {
    response = await prisma.votedComment.create({
      data: {
        userId: user.id,
        commentId: body.id,
      },
      include: {
        comment: {
          include: {
            idea: true,
          },
        },
      },
    });
    if (
      response.comment.idea.authorId &&
      response.comment.idea.authorId !== user.id
    ) {
      const { applyToWeekly, applyToMonthly, applyToQuarterly, applyToYearly } =
        getPointsToModify(new Date());
      await prisma.userInWorkspace.update({
        where: {
          userId_workspaceId: {
            userId: response.comment.authorId,
            workspaceId: response.comment.idea.workspaceId,
          },
        },
        data: {
          points: {
            increment: 1,
          },
          ...(applyToWeekly
            ? {
                pointsInWeek: {
                  increment: 1,
                },
              }
            : {}),
          ...(applyToMonthly
            ? {
                pointsInMonth: {
                  increment: 1,
                },
              }
            : {}),
          ...(applyToQuarterly
            ? {
                pointsInQuarter: {
                  increment: 1,
                },
              }
            : {}),
          ...(applyToYearly
            ? {
                pointsInYear: {
                  increment: 1,
                },
              }
            : {}),
        },
      });
    }
  }
  const _createAssociation = await prisma.userInWorkspace.upsert({
    create: {
      userId: user.id,
      workspaceId: response.comment.idea.workspaceId,
    },
    update: {},
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: response.comment.idea.workspaceId,
      },
    },
    include: {
      workspace: {
        select: {
          name: true,
        },
      },
    },
  });
  revalidatePath(`/${_createAssociation.workspace.name}/community`);

  return {
    isSuccess: true,
  };
};

export interface IReplyComment {
  id: string;
  reply: string;
  ideaId: string;
}

export const replyComment = async (
  body: IReplyComment,
  access_token?: string
) => {
  const supabase = createClient();
  const currentUser = await supabase.auth.getUser(access_token);
  if (!currentUser.data.user) {
    return {
      isSuccess: false,
      error: "Session not found",
    };
  }
  const user = await prisma.users.findFirst({
    where: {
      id: currentUser.data.user.id,
    },
  });
  if (!user) {
    return {
      isSuccess: false,
      error: "User not found",
    };
  }

  const newReply = await prisma.comment.create({
    data: {
      text: body.reply,
      authorId: user.id,
      parentId: body.id,
      ideaId: body.ideaId,
    },
    include: {
      idea: true,
    },
  });

  const _createAssociation = await prisma.userInWorkspace.upsert({
    create: {
      userId: user.id,
      workspaceId: newReply.idea.workspaceId,
    },
    update: {},
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: newReply.idea.workspaceId,
      },
    },
    select: {
      workspace: {
        select: {
          name: true,
        },
      },
    },
  });
  return {
    isSuccess: true,
    id: newReply.id,
  };
};
