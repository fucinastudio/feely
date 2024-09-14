'use server';

import { IAccessToken } from '@/app/api/apiClient';
import { isAdmin } from '@/app/api/apiServerActions/userApiServerActions';
import { IPatchWorkspace } from '@/app/api/controllers/workspaceController';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/prisma/client';

// Server example
export const checkWorkspaceExistanceServer = async (workspaceName: string) => {
  const res = await prisma.workspace.findFirst({
    where: {
      name: workspaceName,
    },
  });
  if (res) {
    return true;
  }
  return false;
};

export const getWorkspaceByName = async (
  workspaceName: string,
  retrieveImage = false
) => {
  const res = await prisma.workspace.findFirst({
    where: {
      name: workspaceName,
    },
    include: {
      workspaceSettings: true,
    },
  });
  if (res) {
    if (retrieveImage) {
      const supabase = createClient();
      const image = supabase.storage.from('images').getPublicUrl(res?.id);
      return { ...res, imageUrl: image.data.publicUrl };
    }
    return res;
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
      error: 'Workspace already exists',
    };
  }
  const supabase = createClient();
  const currentUser = await supabase.auth.getUser(access_token);
  if (!currentUser.data.user) {
    return {
      isSuccess: false,
      error: 'Session not found',
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
      error: 'User not found',
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
      error: 'User already has a workspace',
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
      error: 'Failed to create workspace',
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
    '🐛 Bug',
    '✨ Feature',
    '🔗 Integration',
    '🚀 Improvement',
    '❓ Question',
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
      error: 'Failed to initialize the workspace correctly',
    };
  }

  //Create default statuses
  const defaultStatuses = [
    'In review',
    'Planned',
    'In progress',
    'Completed',
    'Archived',
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
      error: 'Failed to initialize the workspace correctly',
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
      error: 'Session not found',
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
      error: 'User not found',
    };
  }
  const isAdminResult = await isAdmin({
    access_token,
    check_option: 'id',
    current_org: workspaceId,
  });
  if (!isAdminResult.isSuccess) {
    return {
      isSuccess: false,
      error: 'Unauthorized',
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
      error: 'Failed to update workspace',
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
  console.log('Caled');
  const supabase = createClient();
  const currentUser = await supabase.auth.getUser(access_token);
  if (!currentUser.data.user) {
    return {
      isSuccess: false,
      error: 'Session not found',
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
      error: 'User not found',
    };
  }
  const isAdminResult = await isAdmin({
    access_token,
    check_option: 'id',
    current_org: workspaceId,
  });
  if (!isAdminResult.isSuccess) {
    return {
      isSuccess: false,
      error: 'Unauthorized',
    };
  }
  const image = await supabase.storage
    .from('images')
    .upload(workspaceId, workspaceFile, {
      upsert: true,
    });
  if (!image.data) {
    return {
      isSuccess: false,
      error: 'Error while uploading the image',
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
      error: 'Session not found',
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
      error: 'User not found',
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
      error: 'Workspace not found',
    };
  }
  return {
    isSuccess: true,
    workspace: workspace,
  };
};
