"use server";

import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";

export const getPrices = async (): Promise<{
  data?: Prisma.priceGetPayload<{}>[];
}> => {
  const prices = await prisma.price.findMany();

  return {
    data: prices,
  };
};
