import { Prisma } from "@prisma/client";

export type IIdeaSelectionObject = {
  include: {
    product: true;
  };
};

export type PriceType = Prisma.priceGetPayload<IIdeaSelectionObject>;
