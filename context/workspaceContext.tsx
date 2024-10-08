'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useGetStatusesByWorkspaceName } from '@/app/api/controllers/statusController';
import { useGetTopicsByWorkspaceName } from '@/app/api/controllers/topicController';
import { useGetWorkspace } from '@/app/api/controllers/workspaceController';
import { StatusType } from '@/types/status';
import { TopicType } from '@/types/topic';
import { WorkspaceTypeWithImageAndSettings } from '@/types/workspace';
import {
  NeutralColorType,
  PrimaryColorType,
  changeFontFamily,
  changeNeutralColor,
  changePrimaryColor,
} from '@/utils/themes';
import { useGetUser } from '@/app/api/controllers/userController';
import { UserType } from '@/types/user';

interface IWorkspaceContext {
  org: string;
  workspace: WorkspaceTypeWithImageAndSettings | null;
  isLoadingWorkspace: boolean;
  statuses: StatusType[] | null;
  topics: TopicType[] | null;
  onChangeImage: () => void;
}

// Create the AuthContext with default values
const WorkspaceContext = createContext<IWorkspaceContext | undefined>(
  undefined
);

WorkspaceContext.displayName = 'WorkspaceContext';

export const WorkspaceProvider = ({
  children,
  org: initialOrg,
}: {
  children: ReactNode;
  org: string;
}) => {
  const [org, setOrg] = useState<string>(initialOrg);

  const {
    data: workspace,
    isLoading: isLoadingWorkspace,
    isRefetching: isRefetchingWorkspace,
  } = useGetWorkspace({
    workspaceName: org,
  });

  const { data: statuses } = useGetStatusesByWorkspaceName({
    workspaceName: org,
  });

  const { data: topics } = useGetTopicsByWorkspaceName({
    workspaceName: org,
  });

  const [randomNumber, setRandomNumber] = useState<number>(
    Math.floor(Math.random() * 10000)
  );

  const onChangeImage = () => {
    setRandomNumber(Math.floor(Math.random() * 10000));
  };

  const workspaceToExport = useMemo(() => {
    return workspace?.data.workspace
      ? {
          ...workspace?.data.workspace,
          imageUrl: workspace?.data.workspace?.imageUrl
            ? workspace.data.workspace.imageUrl + `?c=${randomNumber}`
            : '',
        }
      : null;
  }, [workspace, randomNumber]);

  useEffect(() => {
    if (!workspaceToExport?.workspaceSettings) return;
    if (workspaceToExport.workspaceSettings.primaryColor)
      changePrimaryColor(
        workspaceToExport.workspaceSettings.primaryColor as PrimaryColorType
      );
    if (workspaceToExport.workspaceSettings.neutralColor)
      changeNeutralColor(
        workspaceToExport.workspaceSettings.neutralColor as NeutralColorType
      );
    if (workspaceToExport.workspaceSettings.fontFamily)
      changeFontFamily(workspaceToExport.workspaceSettings.fontFamily);
  }, [workspaceToExport]);

  return (
    <WorkspaceContext.Provider
      value={{
        org,
        workspace: workspaceToExport,
        isLoadingWorkspace,
        statuses: statuses?.data.statuses ?? null,
        topics: topics?.data.topics ?? null,
        onChangeImage,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

// Custom hook for using the WorkspaceContext
export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
