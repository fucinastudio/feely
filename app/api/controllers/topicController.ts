import { useMutation, useQuery, useQueryClient } from "react-query";

import client, { FeelyRequest } from "@/app/api/apiClient";
import { Endpoints } from "@/app/api/endpoints";
import { TopicType } from "@/types/topic";
import { AxiosError } from "axios";
import { FeelyError } from "@/types/feelyError";
import { toast } from "@fucina/ui";

export const useGetTopicsByWorkspaceName = (
  params: {
    workspaceName: string;
  },
  enabled = true
) => {
  const urlParams = new URLSearchParams({
    ...(params.workspaceName ? { org: params.workspaceName } : {}),
  });
  const request: FeelyRequest = {
    url: `${Endpoints.topic.main}?${urlParams.toString()}`,
    config: {
      method: "get",
    },
  };
  const requestConfig = {
    queryKey: [Endpoints.topic.main, urlParams.toString()],
    queryFn: () => client(request),
    staleTime: 20 * 60 * 1000,
    enabled,
  };

  return useQuery<
    {
      data: {
        topics: TopicType[] | null;
        isSuccess: boolean;
      };
    },
    null
  >(requestConfig);
};

export type ICreateTopic = {
  workspaceId: string;
  topicName: string;
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  const createTopicFunctions = async (createTopic: ICreateTopic) => {
    const req: FeelyRequest = {
      url: Endpoints.topic.main,
      config: {
        method: "POST",
        data: JSON.stringify({ data: createTopic }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; id?: string } },
    null,
    ICreateTopic
  >(createTopicFunctions, {
    onSettled: () => {
      queryClient.invalidateQueries([Endpoints.topic.main]);
    },
  });
};

export type IUpdateTopic = ICreateTopic & {
  topicId: string;
};

export const usePatchTopic = () => {
  const queryClient = useQueryClient();
  const patchTopicFunction = async (patchTopic: IUpdateTopic) => {
    const req: FeelyRequest = {
      url: Endpoints.topic.main,
      config: {
        method: "PATCH",
        data: JSON.stringify({ data: patchTopic }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; id?: string } },
    null,
    IUpdateTopic
  >(patchTopicFunction, {
    onSettled: () => {
      queryClient.invalidateQueries([Endpoints.topic.main]);
    },
  });
};

export type IDeleteTopic = {
  workspaceId: string;
  topicId: string;
};

export const useDeleteTopic = () => {
  const queryClient = useQueryClient();
  const deleteTopicFunction = async (deleteTopic: IDeleteTopic) => {
    const req: FeelyRequest = {
      url: Endpoints.topic.main,
      config: {
        method: "DELETE",
        data: JSON.stringify({ data: deleteTopic }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; id?: string; isSuccess: boolean } },
    FeelyError,
    IDeleteTopic
  >(deleteTopicFunction, {
    onSettled: (value, error, variables) => {
      queryClient.invalidateQueries([Endpoints.topic.main]);
    },
    onSuccess: (_d) => {
      toast("Topic deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data.message ?? "Error while deleting topic");
    },
  });
};
