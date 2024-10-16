"use server";

import { Prisma } from "@prisma/client";

import { IAccessToken } from "@/app/api/apiClient";
import { isAdmin } from "@/app/api/apiServerActions/userApiServerActions";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/prisma/client";

export const getWorkspaceSettings = async (workspaceName: string) => {
  const res = await prisma.workspaceSettings.findFirst({
    where: {
      workspace: {
        name: {
          equals: workspaceName,
          mode: "insensitive",
        },
      },
    },
  });
  if (!res) {
    return {
      isSuccess: false,
      error: "Workspace settings not found",
    };
  }

  return res;
};

export type IPatchWorkspaceSettings = Prisma.workspaceSettingsUpdateInput & {
  workspaceName: string;
};

export const patchWorkspaceSettings = async ({
  workspaceName,
  showIdeas,
  showCommunity,
  showRoadmap,
  access_token,
  fontFamily,
  neutralColor,
  primaryColor,
}: IPatchWorkspaceSettings & IAccessToken) => {
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
  const isAdminRes = await isAdmin({
    access_token,
    check_option: "name",
    current_org: workspaceName,
  });
  if (!isAdminRes.isSuccess) {
    return {
      isSuccess: false,
      error: "Unauthorized",
    };
  }
  const workspace = await prisma.workspace.findFirst({
    where: {
      name: {
        equals: workspaceName,
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
  const updatedWorkspaceSettings = await prisma.workspaceSettings.update({
    where: {
      workspaceId: workspace.id,
    },
    data: {
      showIdeas,
      showRoadmap,
      showCommunity,
      fontFamily,
      neutralColor,
      primaryColor,
    },
  });
  if (!updatedWorkspaceSettings) {
    return {
      isSuccess: false,
      error: "Error while updating workspace settings",
    };
  }

  return { isSuccess: true, workspaceSettings: updatedWorkspaceSettings };
};
