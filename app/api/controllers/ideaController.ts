import { useMutation, useQuery, useQueryClient } from "react-query";

import client, { FeelyRequest } from "@/app/api/apiClient";
import {
  ICreateIdea,
  IPatchIdea,
  IVoteIdea,
} from "@/app/api/apiServerActions/ideaApiServerActions";
import { Endpoints } from "@/app/api/endpoints";
import { IGetIdeasByWorkspaceName } from "@/types/DTO/getIdeasByWorkspaceNameDTO";
import { IdeaType, IdeaWithCommentsType } from "@/types/idea";
import { AxiosError, AxiosResponse } from "axios";

export const useGetIdeasByWorkspaceName = (
  params: IGetIdeasByWorkspaceName,
  enabled = true
) => {
  const urlParams = new URLSearchParams({
    workspaceName: params.workspaceName,
    ...(params.title ? { title: params.title } : {}),
    ...(params.statusId ? { statusId: params.statusId.sort().join(",") } : {}),
    ...(params.topicId ? { topicId: params.topicId.sort().join(",") } : {}),
    ...(params.orderBy ? { orderBy: params.orderBy } : {}),
  });
  const request: FeelyRequest = {
    url: `${Endpoints.idea.workspace.main}?${urlParams.toString()}`,
    config: {
      method: "get",
    },
  };
  const requestConfig = {
    queryKey: [Endpoints.idea.workspace.main, urlParams.toString()],
    queryFn: () => client(request),
    staleTime: 60 * 1000,
    enabled,
  };

  return useQuery<
    {
      data: {
        message: string;
        ideas: IdeaType[];
      };
    },
    null
  >(requestConfig);
};

export const useCreateIdea = () => {
  const queryClient = useQueryClient();
  const createIdeaFunction = async (createIdea: ICreateIdea) => {
    const req: FeelyRequest = {
      url: Endpoints.idea.createIdea,
      config: {
        method: "POST",
        data: JSON.stringify({ data: createIdea }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; id?: string; name?: string } },
    null,
    ICreateIdea
  >(createIdeaFunction, {
    onSettled: () => {
      queryClient.invalidateQueries([Endpoints.idea.workspace.main]);
    },
  });
};

export const useGetIdeaById = ({ id }: { id: string }) => {
  const params = new URLSearchParams({ id });
  const request: FeelyRequest = {
    url: `${Endpoints.idea.main}?${params.toString()}`,
    config: {
      method: "get",
    },
  };

  const requestConfig = {
    queryKey: [Endpoints.idea.main, id],
    queryFn: () => client(request),
    staleTime: 60 * 1000,
  };

  return useQuery<
    {
      data: {
        message: string;
        idea: IdeaWithCommentsType;
      };
    },
    null
  >(requestConfig);
};

export interface IGetIdeasByUserInWorkspace {
  userId: string;
  workspaceId: string;
}
export const useGetIdeaByUserInWorkspace = (
  { userId, workspaceId }: IGetIdeasByUserInWorkspace,
  enabled = true
) => {
  const params = new URLSearchParams({ userId, workspaceId });
  const request: FeelyRequest = {
    url: `${Endpoints.idea.workspace.user}?${params.toString()}`,
    config: {
      method: "get",
    },
  };

  const requestConfig = {
    queryKey: [Endpoints.idea.workspace.user, userId, workspaceId],
    queryFn: () => client(request),
    staleTime: 5 * 60 * 1000,
    enabled,
  };

  return useQuery<
    {
      data: {
        message: string;
        ideas: IdeaType[];
      };
    },
    null
  >(requestConfig);
};

export const useVoteIdea = () => {
  const queryClient = useQueryClient();
  const voteIdeaFunction = async (voteIdea: IVoteIdea) => {
    const req: FeelyRequest = {
      url: Endpoints.idea.vote,
      config: {
        method: "POST",
        data: JSON.stringify({ data: voteIdea }),
      },
    };
    return await client(req);
  };

  return useMutation<{ data: { message: string } }, null, IVoteIdea>(
    voteIdeaFunction,
    {
      onSettled: (_a, _b, variables) => {
        queryClient.invalidateQueries([Endpoints.idea.workspace.main]);
        queryClient.invalidateQueries([Endpoints.idea.main, variables.id]);
      },
    }
  );
};

export const usePatchIdea = () => {
  const queryClient = useQueryClient();
  const patchIdeaFunction = async (patchIdeaBody: IPatchIdea) => {
    const req: FeelyRequest = {
      url: Endpoints.idea.main,
      config: {
        method: "PATCH",
        data: JSON.stringify({ data: patchIdeaBody }),
      },
    };
    return await client(req);
  };

  return useMutation<{ data: { message: string } }, null, IPatchIdea>(
    patchIdeaFunction,
    {
      onSettled: (_a, _b, variables) => {
        queryClient.invalidateQueries([Endpoints.idea.workspace.main]);
        queryClient.invalidateQueries([Endpoints.idea.main, variables.ideaId]);
      },
    }
  );
};

export const useDeleteIdea = () => {
  const queryClient = useQueryClient();
  const deleteIdeaFunction = async (ideaId: string) => {
    const req: FeelyRequest = {
      url: `${Endpoints.idea.main}?id=${ideaId}`,
      config: {
        method: "DELETE",
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string } },
    AxiosError<{ message: string }> | null,
    string
  >(deleteIdeaFunction, {
    onSettled: (_a, _b, variables) => {
      queryClient.invalidateQueries([Endpoints.idea.workspace.main]);
      queryClient.invalidateQueries([Endpoints.idea.main, variables]);
    },
  });
};
