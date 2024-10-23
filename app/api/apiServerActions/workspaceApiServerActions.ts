"use server";

import { IAccessToken } from "@/app/api/apiClient";
import {
  isAdmin,
  isOwner,
} from "@/app/api/apiServerActions/userApiServerActions";
import { IPatchWorkspace } from "@/app/api/controllers/workspaceController";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/prisma/client";
import { AwardType, Prisma, userInWorkspace } from "@prisma/client";

// Server example
export const checkWorkspaceExistanceServer = async (workspaceName: string) => {
  const res = await prisma.workspace.findFirst({
    where: {
      name: {
        equals: workspaceName,
        mode: "insensitive",
      },
    },
  });
  if (res) {
    return true;
  }
  return false;
};

export const getWorkspaceByName = async (
  workspaceName: string,
  retrieveImage = false,
  checkIfPro = false
) => {
  const res = await prisma.workspace.findFirst({
    where: {
      name: {
        equals: workspaceName,
        mode: "insensitive",
      },
    },
    include: {
      workspaceSettings: true,
    },
  });
  let workspaceSubscription = null;
  if (checkIfPro) {
    workspaceSubscription = await prisma.subscription.findFirst({
      where: {
        workspace_id: res?.id,
        status: "active",
      },
    });
  }
  if (res) {
    if (retrieveImage) {
      const supabase = createClient();
      const image = supabase.storage.from("images").getPublicUrl(res?.id);
      return {
        ...res,
        imageUrl: image.data.publicUrl,
        isPro: !!workspaceSubscription,
      };
    }
    return { ...res, isPro: !!workspaceSubscription };
  }
  return null;
};

export const createWorkspace = async (
  workspaceName: string,
  access_token?: string
) => {
  const alreadyExists = await checkWorkspaceExistanceServer(workspaceName);
  if (alreadyExists) {
    return {
      isSuccess: false,
      error: "Workspace already exists",
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
  //Check if the user already has a workspace
  const userWorkspace = await prisma.workspace.findFirst({
    where: {
      ownerId: user?.id,
    },
  });
  if (userWorkspace) {
    return {
      isSuccess: false,
      error: "User already has a workspace",
    };
  }
  const newWorkspace = await prisma.workspace.create({
    data: {
      name: workspaceName,
      externalName: workspaceName,
      ownerId: user?.id,
    },
  });
  if (!newWorkspace) {
    return {
      isSuccess: false,
      error: "Failed to create workspace",
    };
  }

  //Create workspaceSettings
  const workspaceSettings = await prisma.workspaceSettings.create({
    data: {
      workspaceId: newWorkspace.id,
    },
  });

  //Create default topics
  const defaultTopics = [
    "🐛 Bug",
    "✨ Feature",
    "🔗 Integration",
    "🚀 Improvement",
    "❓ Question",
  ];
  const resultTopics = await prisma.topic.createMany({
    data: defaultTopics.map((topic) => ({
      name: topic,
      workspaceId: newWorkspace.id,
    })),
  });
  if (resultTopics.count !== defaultTopics.length) {
    //Delete created topics
    await prisma.topic.deleteMany({
      where: {
        workspaceId: newWorkspace.id,
      },
    });
    //Delete the workspace
    await prisma.workspace.delete({
      where: {
        id: newWorkspace.id,
      },
    });

    return {
      isSuccess: false,
      error: "Failed to initialize the workspace correctly",
    };
  }

  //Create default statuses
  const defaultStatuses = [
    "In review",
    "Planned",
    "In progress",
    "Completed",
    "Archived",
  ];
  const resultStatuses = await prisma.status.createMany({
    data: defaultStatuses.map((status, index) => ({
      name: status,
      workspaceId: newWorkspace.id,
      order: index,
    })),
  });
  if (resultStatuses.count !== defaultStatuses.length) {
    //Delete created statuses
    await prisma.status.deleteMany({
      where: {
        workspaceId: newWorkspace.id,
      },
    });
    //Delete created topics
    await prisma.topic.deleteMany({
      where: {
        workspaceId: newWorkspace.id,
      },
    });
    //Delete the workspace
    await prisma.workspace.delete({
      where: {
        id: newWorkspace.id,
      },
    });

    return {
      isSuccess: false,
      error: "Failed to initialize the workspace correctly",
    };
  }
  return {
    isSuccess: true,
    id: newWorkspace.id,
  };
};

export const createPaymentWorkspace = async (
  workspaceName: string,
  email: string
): Promise<{
  isSuccess: boolean;
  error?: string;
  id?: string;
}> => {
  const alreadyExists = await checkWorkspaceExistanceServer(workspaceName);
  if (alreadyExists) {
    //For now we create the same with an additional number
    const newWorkspace = await createPaymentWorkspace(
      workspaceName + "1",
      email
    );
    return newWorkspace;
  }
  const user = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    return {
      isSuccess: false,
      error: "User not found",
    };
  }
  const newWorkspace = await prisma.workspace.create({
    data: {
      name: workspaceName,
      externalName: workspaceName,
      ownerId: user?.id,
    },
  });
  if (!newWorkspace) {
    return {
      isSuccess: false,
      error: "Failed to create workspace",
    };
  }
  //TODO: this part can be refactored to be shared with the normal creation
  //Create workspaceSettings
  const workspaceSettings = await prisma.workspaceSettings.create({
    data: {
      workspaceId: newWorkspace.id,
    },
  });

  //Create default topics
  const defaultTopics = [
    "🐛 Bug",
    "✨ Feature",
    "🔗 Integration",
    "🚀 Improvement",
    "❓ Question",
  ];
  const resultTopics = await prisma.topic.createMany({
    data: defaultTopics.map((topic) => ({
      name: topic,
      workspaceId: newWorkspace.id,
    })),
  });
  if (resultTopics.count !== defaultTopics.length) {
    //Delete created topics
    await prisma.topic.deleteMany({
      where: {
        workspaceId: newWorkspace.id,
      },
    });
    //Delete the workspace
    await prisma.workspace.delete({
      where: {
        id: newWorkspace.id,
      },
    });

    return {
      isSuccess: false,
      error: "Failed to initialize the workspace correctly",
    };
  }

  //Create default statuses
  const defaultStatuses = [
    "In review",
    "Planned",
    "In progress",
    "Completed",
    "Archived",
  ];
  const resultStatuses = await prisma.status.createMany({
    data: defaultStatuses.map((status, index) => ({
      name: status,
      workspaceId: newWorkspace.id,
      order: index,
    })),
  });
  if (resultStatuses.count !== defaultStatuses.length) {
    //Delete created statuses
    await prisma.status.deleteMany({
      where: {
        workspaceId: newWorkspace.id,
      },
    });
    //Delete created topics
    await prisma.topic.deleteMany({
      where: {
        workspaceId: newWorkspace.id,
      },
    });
    //Delete the workspace
    await prisma.workspace.delete({
      where: {
        id: newWorkspace.id,
      },
    });

    return {
      isSuccess: false,
      error: "Failed to initialize the workspace correctly",
    };
  }
  return {
    isSuccess: true,
    id: newWorkspace.id,
  };
};

export const patchWorkspace = async ({
  workspaceId,
  workspaceExternalName,
  workspaceName,
  access_token,
  logoLink,
}: IPatchWorkspace & IAccessToken) => {
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
  const isAdminResult = await isAdmin({
    access_token,
    check_option: "id",
    current_org: workspaceId,
  });
  if (!isAdminResult.isSuccess) {
    return {
      isSuccess: false,
      error: "Unauthorized",
    };
  }
  const newWorkspace = await prisma.workspace.update({
    data: {
      externalName: workspaceExternalName,
      name: workspaceName,
      logoUrl: logoLink,
    },
    where: {
      id: workspaceId,
    },
  });
  //Create default topics
  if (!newWorkspace) {
    return {
      isSuccess: false,
      error: "Failed to update workspace",
    };
  }
  return {
    isSuccess: true,
    id: newWorkspace.id,
    org: newWorkspace.name,
  };
};

export const uploadImageForWorkspace = async ({
  workspaceId,
  workspaceFile,
  access_token,
}: {
  workspaceId: string;
  workspaceFile: File;
} & IAccessToken) => {
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
  const isAdminResult = await isAdmin({
    access_token,
    check_option: "id",
    current_org: workspaceId,
  });
  if (!isAdminResult.isSuccess) {
    return {
      isSuccess: false,
      error: "Unauthorized",
    };
  }
  const image = await supabase.storage
    .from("images")
    .upload(workspaceId, workspaceFile, {
      upsert: true,
    });
  if (!image.data) {
    return {
      isSuccess: false,
      error: "Error while uploading the image",
    };
  }
  return {
    isSuccess: true,
    data: image.data.fullPath,
  };
};

export const getWorkspaceByUser = async () => {
  const supabase = createClient();
  const currentUser = await supabase.auth.getUser();
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
  const workspace = await prisma.workspace.findFirst({
    where: {
      ownerId: user.id,
    },
  });
  if (!workspace) {
    return {
      isSuccess: false,
      error: "Workspace not found",
    };
  }
  return {
    isSuccess: true,
    workspace: workspace,
  };
};

export const getWorkspaceAdmins = async ({
  workspaceId,
  access_token,
}: { workspaceId: string } & IAccessToken) => {
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
  const isAdminResult = await isAdmin({
    access_token,
    check_option: "id",
    current_org: workspaceId,
  });
  if (!isAdminResult.isSuccess) {
    return {
      isSuccess: false,
      error: "Unauthorized",
    };
  }
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
    include: {
      owner: true,
    },
  });
  if (!workspace) {
    return {
      isSuccess: false,
      error: "Workspace not found",
    };
  }
  const admins = await prisma.workspaceAdmin.findMany({
    where: {
      workspaceId,
    },
    include: {
      user: true,
    },
  });
  return {
    isSuccess: true,
    data: [...admins.map((admin) => admin.user), workspace.owner],
  };
};

export const deleteWorkspaceAdmin = async ({
  workspaceId,
  userId,
  access_token,
}: {
  workspaceId: string;
  userId: string;
} & IAccessToken) => {
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
  const isOwnerResult = await isOwner({
    access_token,
    check_option: "id",
    current_org: workspaceId,
  });
  if (!isOwnerResult.isSuccess) {
    return {
      isSuccess: false,
      error: "Unauthorized",
    };
  }
  await prisma.workspaceAdmin.deleteMany({
    where: {
      workspaceId,
      userId,
    },
  });
  return {
    isSuccess: true,
  };
};

export const addWorkspaceAdmins = async ({
  workspaceId,
  emails,
  access_token,
}: {
  workspaceId: string;
  emails: string[];
} & IAccessToken) => {
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
  const isOwnerResult = await isOwner({
    access_token,
    check_option: "id",
    current_org: workspaceId,
  });
  if (!isOwnerResult.isSuccess) {
    return {
      isSuccess: false,
      error: "Unauthorized",
    };
  }
  const users = await prisma.users.findMany({
    where: {
      email: {
        in: emails,
      },
    },
  });
  const workspaceAdminCreated = await prisma.workspaceAdmin.createMany({
    data: users.map((user) => ({
      userId: user.id,
      workspaceId,
    })),
    skipDuplicates: true,
  });
  return {
    isSuccess: true,
    count: workspaceAdminCreated.count,
  };
};

export const getUserWorkspaces = async ({ access_token }: IAccessToken) => {
  //Get the workspaces of the currentUser in the access token, both if he is the owner or an admin
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
  const workspaces = await prisma.workspace.findMany({
    where: {
      OR: [
        {
          ownerId: user.id,
        },
        {
          workspaceAdmin: {
            some: {
              userId: user.id,
            },
          },
        },
      ],
    },
    include: {
      subscription: {
        select: {
          id: true,
        },
      },
    },
  });

  const workspacesWithSubscription = workspaces.map((workspace) => ({
    ...workspace,
    isPro: workspace.subscription.length > 0,
    subscription: undefined,
  }));

  return {
    isSuccess: true,
    data: workspacesWithSubscription,
  };
};

export const terminatePeriodForWorkspaceAndGrantAwards = async (
  workspaceId: string,
  period: AwardType,
  password: string
) => {
  if (password !== process.env.ADMIN_PASSWORD) {
    return {
      isSuccess: false,
      error: "Unauthorized",
    };
  }
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
  });
  if (!workspace) {
    return {
      isSuccess: false,
      error: "Workspace not found",
    };
  }
  const attributeToConsider: keyof userInWorkspace =
    period === "WEEK"
      ? "pointsInWeek"
      : period === "MONTH"
      ? "pointsInMonth"
      : period === "QUARTER"
      ? "pointsInQuarter"
      : "pointsInYear";
  const usersInWorkspace = await prisma.userInWorkspace.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      [attributeToConsider]: "desc",
    },
  });
  if (!usersInWorkspace) {
    return {
      isSuccess: false,
      error: "Users not found",
    };
  }
  // Assign awards
  let awards: {
    userId: string;
    rank: number;
  }[] = [];
  let rank = 1; //Current rank we are giving
  let previousPoints = usersInWorkspace.at(0)?.[attributeToConsider] ?? 0; // Points of the previous user to check if we should give the same award
  let awardCount = 0; // Tracks how many awards we have given (maybe useless)

  for (let i = 0; i < usersInWorkspace.length && rank <= 3; i++) {
    const user = usersInWorkspace[i];

    // Skip users with 0 points
    if (user[attributeToConsider] <= 0) {
      break;
    }

    // If user has different points than previous, update rank
    if (previousPoints !== user[attributeToConsider]) {
      rank = rank + 1; // Update rank
      previousPoints = user[attributeToConsider]; // Store the current points for comparison in next iteration
    }

    // Award only for top 3 ranks
    if (rank <= 3) {
      awards.push({
        userId: user.userId,
        rank,
      });
      awardCount++;
    }
  }
  //Gran the awards
  await prisma.userInWorkspaceAwards.createMany({
    data: awards.map((award) => ({
      userId: award.userId,
      workspaceId,
      awardType: period,
      position: award.rank,
    })),
  });

  //Remove points
  await prisma.userInWorkspace.updateMany({
    where: {
      workspaceId,
    },
    data: {
      [attributeToConsider]: 0,
    },
  });
};

//Function that can be used to terminate a period for all workspaces, calculating awards and resetting points
export const terminatePeriodForAllWorkspacesAndGrantAwards = async (
  period: AwardType,
  password: string
) => {
  if (password !== process.env.ADMIN_PASSWORD) {
    return {
      isSuccess: false,
      error: "Unauthorized",
    };
  }
  const workspaces = await prisma.workspace.findMany();
  if (!workspaces) {
    return {
      isSuccess: false,
      error: "Workspaces not found",
    };
  }
  for (const workspace of workspaces) {
    await terminatePeriodForWorkspaceAndGrantAwards(
      workspace.id,
      period,
      password
    );
  }
  return {
    isSuccess: true,
  };
};
