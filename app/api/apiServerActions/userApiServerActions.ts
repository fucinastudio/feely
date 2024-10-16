"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { IAccessToken } from "@/app/api/apiClient";
import { PeriodType } from "@/types/enum/period";
import prisma from "@/prisma/client";
import { createClient } from "@/utils/supabase/server";

export const logoutUser = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message);
  }
  redirect("/");
};

interface IGetUserDTO {
  check_option?: "id" | "name";
  current_org?: string;
}

export const getUser = async ({
  check_option = "name",
  current_org,
  access_token,
}: IGetUserDTO & IAccessToken) => {
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
    select: {
      id: true,
      email: true,
      image_url: true,
      name: true,
    },
  });
  if (!user) {
    return {
      isSuccess: false,
      error: "User not found",
    };
  }
  let isAdmin = false;
  if (current_org) {
    const userWorkspace = await prisma.workspace.findFirst({
      where: {
        name: check_option === "name" ? current_org : undefined,
        id: check_option === "id" ? current_org : undefined,
        ownerId: user.id,
      },
    });
    if (userWorkspace) {
      isAdmin = userWorkspace.ownerId === user.id;
    }
  }
  return {
    isSuccess: true,
    data: {
      user,
      isAdmin,
    },
  };
};

export interface IGetUserByIdDTO {
  workspaceId: string;
  userId: string;
}

export const getUserById = async ({
  workspaceId,
  userId,
  access_token,
}: IGetUserByIdDTO & IAccessToken) => {
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
      id: userId,
      userInWorkspace: {
        some: {
          workspaceId: workspaceId,
        },
      },
    },
    include: {
      userInWorkspace: {
        where: {
          workspaceId,
        },
      },
    },
  });
  if (!user) {
    return {
      isSuccess: false,
      error: "User not found",
    };
  }
  const { userInWorkspace, ...rest } = user;
  return {
    isSuccess: true,
    data: {
      user: {
        ...userInWorkspace[0],
        ...rest,
      },
    },
  };
};

export const isAdmin = async (body: IGetUserDTO & IAccessToken) => {
  const user = await getUser(body);
  if (!user.data?.isAdmin) {
    return {
      isSuccess: false,
      error: "User is not an admin",
    };
  }
  return {
    isSuccess: true,
  };
};

export const getUsersForWorkspace = async ({
  workspaceName,
  workspaceId,
  period,
  access_token,
}: {
  workspaceName: string | null;
  workspaceId: string | null;
  period: PeriodType;
} & IAccessToken) => {
  const supabase = createClient();
  const currentUser = await supabase.auth.getUser(access_token);
  if (!currentUser.data.user) {
    return {
      isSuccess: false,
      error: "Session not found",
    };
  }
  if (!workspaceName && !workspaceId) {
    return {
      isSuccess: false,
      error: "Workspace identifier required",
    };
  }
  if (!workspaceId) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        name: {
          equals: workspaceName!,
          mode: "insensitive",
        },
      },
    });
    if (!workspace) {
      return {
        isSuccess: false,
        error: "Workspace not found",
      };
    }
    workspaceId = workspace.id;
  }
  const orderByObject = {
    ...(period === "Last week" && {
      pointsInWeek: "desc",
    }),
    ...(period === "Last month" && {
      pointsInMonth: "desc",
    }),
    ...(period === "Last quarter" && {
      pointsInQuarter: "desc",
    }),
    ...(period === "Last year" && {
      pointsInYear: "desc",
    }),
  } as Prisma.userInWorkspaceOrderByWithRelationInput;
  const users = await prisma.userInWorkspace.findMany({
    where: {
      workspaceId,
    },
    include: {
      user: true,
    },
    orderBy: orderByObject,
  });

  return {
    isSuccess: true,
    data: {
      users: users.map((userFromDb) => {
        const { user, ...rest } = userFromDb;
        return {
          ...rest,
          ...user,
        };
      }),
    },
  };
};

export interface IPatchUser {
  id: string;
  name?: string | null;
  image_url?: string | null;
}

export const patchUser = async ({
  id,
  name,
  image_url,
  access_token,
}: IPatchUser & IAccessToken) => {
  const supabase = createClient();
  const currentUser = await supabase.auth.getUser(access_token);
  if (!currentUser.data.user) {
    return {
      isSuccess: false,
      error: "Session not found",
    };
  }
  if (currentUser.data.user.id !== id) {
    return {
      isSuccess: false,
      error: "User not authorized",
    };
  }
  const user = await prisma.users.update({
    where: {
      id,
    },
    data: {
      name,
      image_url,
    },
  });
  if (user) {
    return {
      isSuccess: true,
    };
  }
  return {
    isSuccess: false,
    error: "Error while updating the user",
  };
};

/**
 * 
 * //Get the users that have had any kind of interaction with the workspace
  const users = await prisma.users.findMany({
    where: {
      OR: [
        {
          voted: {
            some: {
              idea: {
                workspaceId: {
                  equals: workspaceId,
                },
              },
            },
          },
        },
        {
          votedComments: {
            some: {
              comment: {
                idea: {
                  workspaceId: {
                    equals: workspaceId,
                  },
                },
              },
            },
          },
        },
        {
          ideas: {
            some: {
              workspaceId: {
                equals: workspaceId,
              },
            },
          },
        },
        {
          comments: {
            some: {
              idea: {
                workspaceId: {
                  equals: workspaceId,
                },
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      email: true,
      image_url: true,
      name: true,
    },
  });
 */
