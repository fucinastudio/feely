"use client";

import { useMutation, useQuery, useQueryClient } from "react-query";

import client, { FeelyRequest } from "@/app/api/apiClient";
import { Endpoints } from "@/app/api/endpoints";
import { WorkspaceTypeWithImageAndSettings } from "@/types/workspace";
import { UserType } from "@/types/user";

export const useCheckWorkspaceExistance = () => {
  const checkWorkspaceExistanceFunction = async (workspaceName: string) => {
    const req: FeelyRequest = {
      url: Endpoints.workspace.checkExistance,
      config: {
        method: "POST",
        data: JSON.stringify({ workspaceName }),
      },
    };
    return await client(req);
  };

  return useMutation<{ data: { exists: boolean } }, null, string>(
    checkWorkspaceExistanceFunction,
    {}
  );
};

export const useCreateWorkspace = () => {
  const createWorkspaceFunction = async (workspaceName: string) => {
    const req: FeelyRequest = {
      url: Endpoints.workspace.createWorkspace,
      config: {
        method: "POST",
        data: JSON.stringify({ workspaceName }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; id?: string; name?: string } },
    null,
    string
  >(createWorkspaceFunction, {});
};

export const useGetWorkspace = (
  params: {
    workspaceName: string;
  },
  enabled = true
) => {
  const urlParams = new URLSearchParams({
    ...(params.workspaceName ? { org: params.workspaceName } : {}),
  });
  const request: FeelyRequest = {
    url: `${Endpoints.workspace.main}?${urlParams.toString()}`,
    config: {
      method: "get",
    },
  };
  const requestConfig = {
    queryKey: [Endpoints.workspace.main, urlParams.toString()],
    queryFn: () => client(request),
    staleTime: 5 * 60 * 1000,
    enabled,
  };

  return useQuery<
    {
      data: {
        message: string;
        workspace: WorkspaceTypeWithImageAndSettings | null;
      };
    },
    null
  >(requestConfig);
};

interface IUploadImageWorkspace {
  workspaceId: string;
  workspaceFile: File;
}

export const useUploadImageWorkspace = () => {
  const queryClient = useQueryClient();
  const uploadImageWorkspace = async ({
    workspaceId,
    workspaceFile,
  }: IUploadImageWorkspace) => {
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("workspaceFile", workspaceFile);
    const req: FeelyRequest = {
      url: Endpoints.workspace.uploadImage,
      config: {
        method: "POST",
        data: formData,
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; imageUrl?: string } },
    null,
    IUploadImageWorkspace
  >(uploadImageWorkspace, {
    onSettled: () => {
      queryClient.invalidateQueries([Endpoints.workspace.main]);
    },
  });
};

export interface IPatchWorkspace {
  workspaceId: string;
  workspaceExternalName?: string;
  workspaceName?: string;
  logoLink?: string;
}

export const usePatchWorkspace = () => {
  const queryClient = useQueryClient();
  const patchWorkspace = async (patchWorkspace: IPatchWorkspace) => {
    const req: FeelyRequest = {
      url: Endpoints.workspace.main,
      config: {
        method: "PATCH",
        data: JSON.stringify({ data: patchWorkspace }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; isSuccess: boolean; org: string } },
    null,
    IPatchWorkspace
  >(patchWorkspace, {
    onSettled: () => {
      queryClient.invalidateQueries([Endpoints.workspace.main]);
      queryClient.invalidateQueries([Endpoints.workspaceSettings]);
    },
  });
};

export const useGetWorkspaceAdmins = (
  params: {
    workspaceId: string;
  },
  enabled = true
) => {
  const urlParams = new URLSearchParams({
    ...(params.workspaceId ? { workspaceId: params.workspaceId } : {}),
  });
  const request: FeelyRequest = {
    url: `${Endpoints.workspace.admin}?${urlParams.toString()}`,
    config: {
      method: "get",
    },
  };
  const requestConfig = {
    queryKey: [Endpoints.workspace.admin, urlParams.toString()],
    queryFn: () => client(request),
    staleTime: 5 * 60 * 1000,
    enabled,
  };

  return useQuery<
    {
      data: {
        message: string;
        admins: UserType[] | null;
      };
    },
    null
  >(requestConfig);
};

export interface IDeleteWorkspaceAdmin {
  workspaceId: string;
  userId: string;
}

export const useDeleteWorkspaceAdmin = () => {
  const queryClient = useQueryClient();
  const deleteWorkspaceAdmin = async (
    deleteWorkspaceAdmin: IDeleteWorkspaceAdmin
  ) => {
    const req: FeelyRequest = {
      url: Endpoints.workspace.admin,
      config: {
        method: "DELETE",
        data: JSON.stringify({ data: deleteWorkspaceAdmin }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; isSuccess: boolean } },
    null,
    IDeleteWorkspaceAdmin
  >(deleteWorkspaceAdmin, {
    onSettled: () => {
      queryClient.invalidateQueries([Endpoints.workspace.main]);
      queryClient.invalidateQueries([Endpoints.workspace.admin]);
      queryClient.invalidateQueries([Endpoints.workspaceSettings]);
    },
  });
};

export interface IAddWorskaceAdmins {
  workspaceId: string;
  emails: string[];
}

export const useAddWorkspaceAdmins = () => {
  const queryClient = useQueryClient();
  const addWorkspaceAdmins = async (addWorkspaceAdmins: IAddWorskaceAdmins) => {
    const req: FeelyRequest = {
      url: Endpoints.workspace.admin,
      config: {
        method: "POST",
        data: JSON.stringify({ data: addWorkspaceAdmins }),
      },
    };
    return await client(req);
  };

  return useMutation<
    { data: { message: string; isSuccess: boolean; count: number } },
    null,
    IAddWorskaceAdmins
  >(addWorkspaceAdmins, {
    onSettled: () => {
      queryClient.invalidateQueries([Endpoints.workspace.main]);
      queryClient.invalidateQueries([Endpoints.workspace.admin]);
      queryClient.invalidateQueries([Endpoints.workspaceSettings]);
    },
  });
};
