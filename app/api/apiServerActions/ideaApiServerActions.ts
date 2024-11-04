"use server";

import { revalidatePath } from "next/cache";

import { isAdmin } from "@/app/api/apiServerActions/userApiServerActions";
import { IGetIdeasByUserInWorkspace } from "@/app/api/controllers/ideaController";
import { IAccessToken } from "@/app/api/apiClient";
import { getWorkspaceByName } from "@/app/api/apiServerActions/workspaceApiServerActions";
import { IGetIdeasByWorkspaceName } from "@/types/DTO/getIdeasByWorkspaceNameDTO";
import { IdeaType } from "@/types/idea";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/prisma/client";
import { getPointsToModify } from "@/utils/utils";
import { Constants } from "@/utils/constants";

export interface ICreateIdea {
  org: string;
  title: string;
  description: string;
  topicId: string;
}

export const createIdea = async (body: ICreateIdea, access_token?: string) => {
  const { org } = body;
  const workspace = await getWorkspaceByName(org);
  if (!workspace) {
    return {
      isSuccess: false,
      error: "Workspace do not exist",
    };
  }
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

  const status = await prisma.status.findFirst({
    where: {
      workspaceId: workspace.id,
      order: 0,
    },
  });

  if (!status) {
    return {
      isSuccess: false,
      error: "Couldn't find the default status for the workspace",
    };
  }

  const idea = await prisma.idea.create({
    data: {
      title: body.title,
      description: body.description,
      workspaceId: workspace.id,
      topicId: body.topicId,
      authorId: user.id,
    },
  });
  if (!idea) {
    return {
      isSuccess: false,
    };
  } else {
    const _createAssociation = await prisma.userInWorkspace.upsert({
      create: {
        userId: user.id,
        workspaceId: idea.workspaceId,
      },
      update: {},
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: idea.workspaceId,
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
    revalidatePath(`/${_createAssociation.workspace.name}/community`);
    return {
      isSuccess: true,
      data: idea.id,
    };
  }
};

export const getIdeasByWorkspaceName = async ({
  workspaceName,
  orderBy,
  statusId,
  title,
  topicId,
  access_token,
}: IGetIdeasByWorkspaceName & IAccessToken): Promise<{
  isSuccess: boolean;
  error?: string;
  data?: IdeaType[];
}> => {
  const workspace = await getWorkspaceByName(workspaceName);
  if (!workspace) {
    return {
      isSuccess: false,
      error: "Workspace do not exist",
    };
  }
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
  const ideas = await prisma.idea.findMany({
    where: {
      workspaceId: workspace.id,
      title: {
        contains: title,
      },
      topicId: {
        in: topicId,
      },
      statusId: {
        in: statusId,
      },
    },
    orderBy: {
      ...(orderBy === "least_voted" || orderBy === "most_voted"
        ? {
            voters: {
              _count: orderBy === "most_voted" ? "desc" : "asc",
            },
          }
        : {}),
      ...(orderBy === "latest" || orderBy === "oldest"
        ? {
            created_at: orderBy === "latest" ? "desc" : "asc",
          }
        : {}),
    },
    include: {
      author: {
        include: {
          userInWorkspace: {
            where: {
              workspaceId: workspace.id,
            },
          },
        },
      },
      status: true,
      topic: true,
      _count: {
        select: {
          comments: true,
        },
      },
      voters: {
        include: {
          user: {
            select: {
              id: true,
              image_url: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    take: 50,
  });
  if (!ideas) {
    return {
      isSuccess: false,
    };
  } else {
    const ideasWithVoted = ideas.map((idea) => {
      const isVoted = idea.voters.find((voter) => voter.userId === user.id);
      const {
        voters,
        _count: { comments },
        ...ideaWithoutVoters
      } = idea;
      return {
        ...ideaWithoutVoters,
        isVoted: !!isVoted,
        voters: voters,
        commentsCount: comments,
      };
    });
    return {
      isSuccess: true,
      data: ideasWithVoted,
    };
  }
};

export const getIdeasByUserInWorkspace = async ({
  workspaceId,
  userId,
  access_token,
}: IGetIdeasByUserInWorkspace & IAccessToken): Promise<{
  isSuccess: boolean;
  error?: string;
  data?: IdeaType[];
}> => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
  });
  if (!workspace) {
    return {
      isSuccess: false,
      error: "Workspace do not exist",
    };
  }
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
  const ideas = await prisma.idea.findMany({
    where: {
      workspaceId,
      authorId: userId,
    },
    include: {
      author: {
        include: {
          userInWorkspace: {
            where: {
              workspaceId: workspace.id,
            },
          },
        },
      },
      status: true,
      topic: true,
      _count: {
        select: {
          comments: true,
        },
      },
      voters: {
        include: {
          user: {
            select: {
              id: true,
              image_url: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    take: 50,
  });
  if (!ideas) {
    return {
      isSuccess: false,
    };
  } else {
    const ideasWithVoted = ideas.map((idea) => {
      const isVoted = idea.voters.find((voter) => voter.userId === user.id);
      const {
        voters,
        _count: { comments },
        ...ideaWithoutVoters
      } = idea;
      return {
        ...ideaWithoutVoters,
        isVoted: !!isVoted,
        voters: voters,
        commentsCount: comments,
      };
    });
    return {
      isSuccess: true,
      data: ideasWithVoted,
    };
  }
};

export const getIdeaById = async ({
  ideaId,
  access_token,
}: {
  ideaId: string;
  access_token: string;
}) => {
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
  const idea = await prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
    include: {
      author: {
        include: {
          userInWorkspace: {
            where: {
              //This is inefficient. We should improve in the future
              workspace: {
                ideas: {
                  some: {
                    id: ideaId,
                  },
                },
              },
            },
          },
        },
      },
      status: true,
      topic: true,
      voters: {
        include: {
          user: {
            select: {
              id: true,
              image_url: true,
              name: true,
              email: true,
            },
          },
        },
      },
      comments: {
        include: {
          author: true,
          childComments: {
            include: {
              author: true,
              votes: true,
            },
          },
          votes: true,
        },
        where: {
          parentId: null,
        },
      },
    },
  });
  if (!idea) {
    return {
      isSuccess: false,
    };
  } else {
    const isVoted = idea.voters.find((voter) => voter.userId === user.id);
    //Check if comments are upvoted
    idea.comments = idea.comments.map((comment) => {
      const isVoted = comment.votes.find((vote) => vote.userId === user.id);
      return { ...comment, isVoted: !!isVoted };
    });
    return {
      isSuccess: true,
      data: {
        ...idea,
        isVoted: !!isVoted,
      },
    };
  }
};

export interface IVoteIdea {
  id: string;
  isVoted: boolean;
}

export const voteIdea = async (body: IVoteIdea, access_token?: string) => {
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
    idea: {
      workspaceId: string;
      authorId: string;
    };
    created_at: Date;
  };
  if (!body.isVoted) {
    response = await prisma.votedIdea.delete({
      where: {
        ideaId_userId: {
          userId: user.id,
          ideaId: body.id,
        },
      },
      include: {
        idea: true,
      },
    });
    if (response.idea.authorId && response.idea.authorId !== user.id) {
      const pointsToGrant = Constants.pointsForReceivedUpvote;
      const { applyToWeekly, applyToMonthly, applyToQuarterly, applyToYearly } =
        getPointsToModify(response.created_at);
      await prisma.userInWorkspace.update({
        where: {
          userId_workspaceId: {
            userId: response.idea.authorId,
            workspaceId: response.idea.workspaceId,
          },
        },
        data: {
          points: {
            decrement: pointsToGrant,
          },
          ...(applyToWeekly
            ? {
                pointsInWeek: {
                  decrement: pointsToGrant,
                },
              }
            : {}),
          ...(applyToMonthly
            ? {
                pointsInMonth: {
                  decrement: pointsToGrant,
                },
              }
            : {}),
          ...(applyToQuarterly
            ? {
                pointsInQuarter: {
                  decrement: pointsToGrant,
                },
              }
            : {}),
          ...(applyToYearly
            ? {
                pointsInYear: {
                  decrement: pointsToGrant,
                },
              }
            : {}),
        },
      });
    }
  } else {
    response = await prisma.votedIdea.create({
      data: {
        userId: user.id,
        ideaId: body.id,
      },
      include: {
        idea: true,
      },
    });
    if (response.idea.authorId && response.idea.authorId !== user.id) {
      const pointsToGrant = Constants.pointsForReceivedUpvote;

      await prisma.userInWorkspace.update({
        where: {
          userId_workspaceId: {
            userId: response.idea.authorId,
            workspaceId: response.idea.workspaceId,
          },
        },
        data: {
          points: {
            increment: pointsToGrant,
          },
          pointsInWeek: {
            increment: pointsToGrant,
          },
          pointsInMonth: {
            increment: pointsToGrant,
          },
          pointsInQuarter: {
            increment: pointsToGrant,
          },
          pointsInYear: {
            increment: pointsToGrant,
          },
        },
      });
    }
  }
  const _createAssociation = await prisma.userInWorkspace.upsert({
    create: {
      userId: user.id,
      workspaceId: response.idea.workspaceId,
    },
    update: {},
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: response.idea.workspaceId,
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
  };
};

export interface IPatchIdea {
  ideaId: string;
  statusId?: string | null;
  topicId?: string | null;
}

export const patchIdea = async ({
  ideaId,
  statusId,
  topicId,
  access_token,
}: IPatchIdea & IAccessToken) => {
  const supabase = createClient();
  const currentUser = await supabase.auth.getUser(access_token);
  if (!currentUser.data.user) {
    return {
      isSuccess: false,
      error: "Session not found",
    };
  }
  const idea = await prisma.idea.findFirst({
    where: {
      id: ideaId,
    },
    include: {
      status: true,
    },
  });
  if (!idea) {
    return {
      isSuccess: false,
      error: "Idea not found",
    };
  }
  const checkUser = await isAdmin({
    current_org: idea.workspaceId,
    check_option: "id",
    access_token,
  });

  if (!checkUser?.isSuccess) {
    return {
      isSuccess: false,
      error: "Unauthorized user",
    };
  }
  //Null if status not changed, true if status changed to completed, false otherwise
  let isNewStatusCompleted: boolean | null = null;
  //Check if statusId and topicId are valid
  if (statusId) {
    const status = await prisma.status.findFirst({
      where: {
        id: statusId,
        workspaceId: idea?.workspaceId,
      },
    });
    if (!status) {
      return {
        isSuccess: false,
        error: "Status not found",
      };
    } else if (status?.order === Constants.completedStatusIndex) {
      isNewStatusCompleted = true;
    } else {
      isNewStatusCompleted = false;
    }
  }
  if (topicId) {
    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        workspaceId: idea?.workspaceId,
      },
    });
    if (!topic) {
      return {
        isSuccess: false,
        error: "Topic not found",
      };
    }
  }
  //Previous status for the points
  const previousStatus = idea.status;
  const ideaUpdated = await prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      statusId: statusId ? statusId : undefined,
      topicId: topicId ? topicId : undefined,
      ...(isNewStatusCompleted
        ? { completed_at: new Date() }
        : isNewStatusCompleted === false
        ? { completed_at: null }
        : {}),
    },
    include: {
      status: true,
    },
  });
  if (!ideaUpdated) {
    return {
      isSuccess: false,
    };
  } else {
    //Grant points if moved to completed
    //=======================NOTE=======================
    //FOR THE MOMENT WE CANNOT CHANGE THE STATUSES, SO WE CONSIDER THE NUMBER 3 (COMPLETED) AS THE ONE THAT GRANTS POINTS
    //=======================NOTE=======================
    if (
      ideaUpdated.status?.order === Constants.completedStatusIndex &&
      previousStatus?.order !== Constants.completedStatusIndex
    ) {
      const pointsToGrant = Constants.pointsForCompletedIdea;
      await prisma.userInWorkspace.update({
        where: {
          userId_workspaceId: {
            userId: idea.authorId,
            workspaceId: idea.workspaceId,
          },
        },
        data: {
          points: {
            increment: pointsToGrant,
          },
          pointsInWeek: {
            increment: pointsToGrant,
          },
          pointsInMonth: {
            increment: pointsToGrant,
          },
          pointsInQuarter: {
            increment: pointsToGrant,
          },
          pointsInYear: {
            increment: pointsToGrant,
          },
        },
      });
    } else if (
      previousStatus?.order === Constants.completedStatusIndex &&
      ideaUpdated.status?.order !== Constants.completedStatusIndex &&
      idea.completed_at
    ) {
      //Remove the points if moved from completed
      const pointsToGrant = Constants.pointsForCompletedIdea;
      const { applyToWeekly, applyToMonthly, applyToQuarterly, applyToYearly } =
        getPointsToModify(idea.completed_at);
      await prisma.userInWorkspace.update({
        where: {
          userId_workspaceId: {
            userId: idea.authorId,
            workspaceId: idea.workspaceId,
          },
        },
        data: {
          points: {
            decrement: pointsToGrant,
          },
          ...(applyToWeekly
            ? {
                pointsInWeek: {
                  decrement: pointsToGrant,
                },
              }
            : {}),
          ...(applyToMonthly
            ? {
                pointsInMonth: {
                  decrement: pointsToGrant,
                },
              }
            : {}),
          ...(applyToQuarterly
            ? {
                pointsInQuarter: {
                  decrement: pointsToGrant,
                },
              }
            : {}),
          ...(applyToYearly
            ? {
                pointsInYear: {
                  decrement: pointsToGrant,
                },
              }
            : {}),
        },
      });
    }
    return {
      isSuccess: true,
    };
  }
};

export const deleteIdea = async ({
  ideaId,
  access_token,
}: {
  ideaId: string;
  access_token: string;
}) => {
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
  const idea = await prisma.idea.findFirst({
    where: {
      id: ideaId,
    },
  });
  if (!idea) {
    return {
      isSuccess: false,
      error: "Idea not found",
    };
  }

  const checkIsAdmin = await isAdmin({
    current_org: idea.workspaceId,
    check_option: "id",
    access_token,
  });
  if (!checkIsAdmin.isSuccess && idea.authorId !== user.id) {
    return {
      isSuccess: false,
      error: "Unauthorized user",
    };
  }
  try {
    const ideaComments = await prisma.comment.findMany({
      where: {
        ideaId,
      },
      include: {
        votes: true,
      },
    });
    //Since these are getting deleted, we need to remove the points
    const pointsToGrant = Constants.pointsForReceivedUpvote;
    ideaComments.forEach(async (comment) => {
      comment.votes.forEach(async (vote) => {
        const {
          applyToWeekly,
          applyToMonthly,
          applyToQuarterly,
          applyToYearly,
        } = getPointsToModify(vote.created_at);
        await prisma.userInWorkspace.update({
          where: {
            userId_workspaceId: {
              userId: comment.authorId,
              workspaceId: idea.workspaceId,
            },
          },
          data: {
            points: {
              decrement: pointsToGrant,
            },
            ...(applyToWeekly
              ? {
                  pointsInWeek: {
                    decrement: pointsToGrant,
                  },
                }
              : {}),
            ...(applyToMonthly
              ? {
                  pointsInMonth: {
                    decrement: pointsToGrant,
                  },
                }
              : {}),
            ...(applyToQuarterly
              ? {
                  pointsInQuarter: {
                    decrement: pointsToGrant,
                  },
                }
              : {}),
            ...(applyToYearly
              ? {
                  pointsInYear: {
                    decrement: pointsToGrant,
                  },
                }
              : {}),
          },
        });
      });
    });
    const deletedIdea = await prisma.idea.delete({
      where: {
        id: ideaId,
      },
      include: {
        voters: true,
        status: true,
      },
    });

    if (!deletedIdea) {
      return {
        isSuccess: false,
        message: "An error occurred while deleting the idea",
      };
    } else {
      //Remove the points given by the votes
      deletedIdea.voters.forEach(async (voter) => {
        const {
          applyToWeekly,
          applyToMonthly,
          applyToQuarterly,
          applyToYearly,
        } = getPointsToModify(voter.created_at);
        await prisma.userInWorkspace.update({
          where: {
            userId_workspaceId: {
              userId: idea.authorId,
              workspaceId: deletedIdea.workspaceId,
            },
          },
          data: {
            points: {
              decrement: Constants.pointsForReceivedUpvote,
            },
            ...(applyToWeekly
              ? {
                  pointsInWeek: {
                    decrement: Constants.pointsForReceivedUpvote,
                  },
                }
              : {}),
            ...(applyToMonthly
              ? {
                  pointsInMonth: {
                    decrement: Constants.pointsForReceivedUpvote,
                  },
                }
              : {}),
            ...(applyToQuarterly
              ? {
                  pointsInQuarter: {
                    decrement: Constants.pointsForReceivedUpvote,
                  },
                }
              : {}),
            ...(applyToYearly
              ? {
                  pointsInYear: {
                    decrement: Constants.pointsForReceivedUpvote,
                  },
                }
              : {}),
          },
        });
      });
      if (
        deletedIdea.status?.order === Constants.completedStatusIndex &&
        deletedIdea.completed_at
      ) {
        //Remove the points if moved from completed
        const pointsToGrant = Constants.pointsForCompletedIdea;
        const {
          applyToWeekly,
          applyToMonthly,
          applyToQuarterly,
          applyToYearly,
        } = getPointsToModify(deletedIdea.completed_at);
        await prisma.userInWorkspace.update({
          where: {
            userId_workspaceId: {
              userId: deletedIdea.authorId,
              workspaceId: deletedIdea.workspaceId,
            },
          },
          data: {
            points: {
              decrement: pointsToGrant,
            },
            ...(applyToWeekly
              ? {
                  pointsInWeek: {
                    decrement: pointsToGrant,
                  },
                }
              : {}),
            ...(applyToMonthly
              ? {
                  pointsInMonth: {
                    decrement: pointsToGrant,
                  },
                }
              : {}),
            ...(applyToQuarterly
              ? {
                  pointsInQuarter: {
                    decrement: pointsToGrant,
                  },
                }
              : {}),
            ...(applyToYearly
              ? {
                  pointsInYear: {
                    decrement: pointsToGrant,
                  },
                }
              : {}),
          },
        });
      }
      return {
        isSuccess: true,
      };
    }
  } catch (e: any) {
    console.log(e);
    return {
      isSuccess: false,
      error:
        "The idea cannot be deleted since there are comments or vote related to it",
    };
  }
};
