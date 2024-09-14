import { useQuery } from 'react-query';

import client, { FeelyRequest } from '@/app/api/apiClient';
import { Endpoints } from '@/app/api/endpoints';
import { StatusType } from '@/types/status';

export const useGetStatusesByWorkspaceName = (
  params: {
    workspaceName: string;
  },
  enabled = true
) => {
  const urlParams = new URLSearchParams({
    ...(params.workspaceName ? { org: params.workspaceName } : {}),
  });
  const request: FeelyRequest = {
    url: `${Endpoints.status.main}?${urlParams.toString()}`,
    config: {
      method: 'get',
    },
  };
  const requestConfig = {
    queryKey: [Endpoints.status.main, urlParams.toString()],
    queryFn: () => client(request),
    staleTime: 20 * 60 * 1000,
    enabled,
  };

  return useQuery<
    {
      data: {
        statuses: StatusType[] | null;
        isSuccess: boolean;
      };
    },
    null
  >(requestConfig);
};
