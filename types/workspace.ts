import { Prisma } from "@prisma/client";

export type IWorkspaceSelectionObject = {
  include: {
    owner: true;
  };
};

export type WorkspaceType =
  Prisma.workspaceGetPayload<IWorkspaceSelectionObject>;

export type WorkspaceTypeWithWorkspaceSettings = Prisma.workspaceGetPayload<{
  include: {
    workspaceSettings: true;
    owner: true;
  };
}>;

export type WorkspaceTypeWithImageAndSettings =
  WorkspaceTypeWithWorkspaceSettings & {
    imageUrl: string;
    isPro?: boolean | null;
  };
