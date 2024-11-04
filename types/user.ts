import { Prisma } from "@prisma/client";

export type IUserSelectionObject = {
  select: {
    id: true;
    name: true;
  };
};

export type UserType = Prisma.usersGetPayload<{
  select: {
    image_url: true;
    id: true;
    email: true;
    name: true;
  };
}>;

export type UserTypeWithPoints = UserType &
  Prisma.userInWorkspaceGetPayload<{}>;

export type UserTypeWithWorkspaces = Prisma.usersGetPayload<{
  include: {
    workspaces: {
      select: {
        id: true;
        name: true;
        ownerId: true;
      };
    };
  };
}>;
