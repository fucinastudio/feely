"use server";

import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";

export const getPrices = async (): Promise<{
  isSuccess: boolean;
  error?: string;
  data?: Prisma.priceGetPayload<{}>[];
}> => {
  const prices = await prisma.price.findMany({
    include: {
      product: true,
    },
  });

  if (!prices) {
    return {
      isSuccess: false,
      error: "Prices not found",
    };
  }
  return {
    isSuccess: true,
    data: prices,
  };
};
