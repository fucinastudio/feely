import client, { FeelyRequest } from "@/app/api/apiClient";
import { Endpoints } from "@/app/api/endpoints";
import { PriceType } from "@/types/price";
import { useQuery } from "react-query";

export const useGetPrices = (enabled = true) => {
  const request: FeelyRequest = {
    url: `${Endpoints.price.main}`,
    config: {
      method: "get",
    },
  };
  const requestConfig = {
    queryKey: [Endpoints.price.main],
    queryFn: () => client(request),
    staleTime: 24 * 60 * 60 * 1000,
    enabled,
  };

  return useQuery<
    {
      data: {
        message: string;
        prices: PriceType[];
      };
    },
    null
  >(requestConfig);
};
