'use client';

import { useMutation, useQueryClient } from 'react-query';

import { IPatchWorkspaceSettings } from '@/app/api/apiServerActions/workspaceSettingsApiServerActions';
import client, { FeelyRequest } from '@/app/api/apiClient';
import { Endpoints } from '@/app/api/endpoints';
import { WorkspaceSettingsType } from '@/types/workspaceSettings';

export const usePatchWorkspaceSettings = () => {
  const queryClient = useQueryClient();
  const patchWorkspaceSettings = async (
    patchWorkspaceSettings: IPatchWorkspaceSettings
  ) => {
    const req: FeelyRequest = {
      url: Endpoints.workspaceSettings.main,
      config: {
        method: 'PATCH',
        data: JSON.stringify({ data: patchWorkspaceSettings }),
      },
    };
    return await client(req);
  };

  return useMutation<
    {
      data: {
        message: string;
        isSuccess: boolean;
        workspaceSettings: WorkspaceSettingsType;
      };
    },
    null,
    IPatchWorkspaceSettings
  >(patchWorkspaceSettings, {
    onSettled: () => {
      queryClient.invalidateQueries([Endpoints.workspace.main]);
      queryClient.invalidateQueries([Endpoints.workspaceSettings.main]);
    },
  });
};
