import { useQuery } from 'react-query';

import client, { FeelyRequest } from '@/app/api/apiClient';
import { IGetUserByIdDTO } from '@/app/api/apiServerActions/userApiServerActions';
import { Endpoints } from '@/app/api/endpoints';
import { IGetUserDTO } from '@/types/DTO/getUserDTO';
import { IGetUserInWorkspaceDTO } from '@/types/DTO/getUserInWorkspaceDTO';
import { UserType, UserTypeWithPoints } from '@/types/user';

export const useGetUser = (params: IGetUserDTO, enabled = true) => {
  const urlParams = new URLSearchParams({
    ...(params.current_org ? { org: params.current_org } : {}),
  });
  const request: FeelyRequest = {
    url: `${Endpoints.user.main}?${urlParams.toString()}`,
    config: {
      method: 'get',
    },
  };
  const requestConfig = {
    queryKey: [Endpoints.user.main, urlParams.toString()],
    queryFn: () => client(request),
    staleTime: 60 * 1000,
    enabled,
  };

  return useQuery<
    {
      data: {
        message: string;
        user: UserType;
        isAdmin: boolean;
      };
    },
    null
  >(requestConfig);
};

export const useGetUserById = (params: IGetUserByIdDTO, enabled = true) => {
  const urlParams = new URLSearchParams({
    workspaceId: params.workspaceId,
    userId: params.userId,
  });
  const request: FeelyRequest = {
    url: `${Endpoints.user.byId}?${urlParams.toString()}`,
    config: {
      method: 'get',
    },
  };
  const requestConfig = {
    queryKey: [Endpoints.user.byId, urlParams.toString()],
    queryFn: () => client(request),
    staleTime: 60 * 1000,
    enabled,
  };

  return useQuery<
    {
      data: {
        message: string;
        user: UserType;
        isAdmin: boolean;
      };
    },
    null
  >(requestConfig);
};

export const useGetUsersForWorkspace = (
  params: IGetUserInWorkspaceDTO,
  enabled = true
) => {
  const urlParams = new URLSearchParams({
    workspaceName: params.current_org,
    workspaceId: params.workspaceId,
    period: params.period,
  });
  const request: FeelyRequest = {
    url: `${Endpoints.user.workspace}?${urlParams.toString()}`,
    config: {
      method: 'get',
    },
  };
  const requestConfig = {
    queryKey: [Endpoints.user.workspace, urlParams.toString()],
    queryFn: () => client(request),
    staleTime: 5 * 60 * 1000,
    enabled,
  };

  return useQuery<
    {
      data: {
        isSuccess: boolean;
        message?: string | null;
        usersInWorkspace?: UserTypeWithPoints[] | null;
      };
    },
    null
  >(requestConfig);
};
