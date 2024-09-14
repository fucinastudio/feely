'use server';

import { revalidatePath } from 'next/cache';

import { IAccessToken } from '@/app/api/apiClient';
import { isAdmin } from '@/app/api/apiServerActions/userApiServerActions';
import {
  ICreateTopic,
  IDeleteTopic,
  IUpdateTopic,
} from '@/app/api/controllers/topicController';
import prisma from '@/prisma/client';
import { createClient } from '@/utils/supabase/server';

interface IGetTopics {
  workspaceId: string;
}

export const getTopics = async ({ workspaceId }: IGetTopics) => {
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
    orderBy: {
      name: 'asc',
    },
  });
  if (!user) {
    return {
      isSuccess: false,
      error: 'User not found',
    };
  }
  const topics = await prisma.topic.findMany({
    where: {
      workspaceId,
    },
  });

  return {
    isSuccess: true,
    data: topics,
  };
};

interface IGetTopicsByWorkspaceName {
  workspaceName: string;
}

export const getTopicsByWorkspaceName = async ({
  workspaceName,
}: IGetTopicsByWorkspaceName & IAccessToken) => {
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
  const topics = await prisma.topic.findMany({
    where: {
      workspace: {
        name: workspaceName,
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
  return {
    isSuccess: true,
    data: topics,
  };
};

export const patchTopic = async ({
  workspaceId,
  topicId,
  topicName,
  access_token,
}: IUpdateTopic & IAccessToken) => {
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
  const newTopic = await prisma.topic.update({
    data: {
      name: topicName,
    },
    where: {
      id: topicId,
      workspaceId,
    },
  });
  //Create default topics
  if (!newTopic) {
    return {
      isSuccess: false,
      error: 'Failed to update topic',
    };
  }
  return {
    isSuccess: true,
    id: newTopic.id,
  };
};

export const addTopic = async ({
  workspaceId,
  topicName,
  access_token,
}: ICreateTopic & IAccessToken) => {
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
  const newTopic = await prisma.topic.create({
    data: {
      name: topicName,
      workspaceId: workspaceId,
    },
  });
  //Create default topics
  if (!newTopic) {
    return {
      isSuccess: false,
      error: 'Failed to create topic',
    };
  }
  revalidatePath(`/${workspaceId}/settings/topics`, 'layout');
  revalidatePath(`/${workspaceId}`);
  return {
    isSuccess: true,
    id: newTopic.id,
  };
};

export const removeTopic = async ({
  workspaceId,
  topicId,
  access_token,
}: IDeleteTopic & IAccessToken) => {
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
  const relatedIdeas = await prisma.idea.count({
    where: {
      workspaceId,
      topicId,
    },
  });
  if (relatedIdeas > 0) {
    return {
      isSuccess: false,
      error: `There are ${relatedIdeas} ideas related to this topic. Please remove them first.`,
    };
  }
  const removedTopic = await prisma.topic.delete({
    where: {
      id: topicId,
      workspaceId: workspaceId,
    },
  });
  //Create default topics
  if (!removedTopic) {
    return {
      isSuccess: false,
      error: 'Failed to create topic',
    };
  }
  return {
    isSuccess: true,
    id: removedTopic.id,
  };
};
