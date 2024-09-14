import { Prisma } from "@prisma/client";

export type IStatusSelectionObject = {
  select: {
    id: true;
    name: true;
  };
};

export type StatusType = Prisma.statusGetPayload<IStatusSelectionObject>;
