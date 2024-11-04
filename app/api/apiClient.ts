import axios, { Method } from "axios";

import { createClient } from "@/utils/supabase/client";
import { getUrl } from "@/utils/utils";

export interface FeelyRequest {
  url: string;
  config: {
    method: Method;
    data?: unknown;
  };
}

export interface IAccessToken {
  access_token?: string;
}

const client = async (req: FeelyRequest) => {
  const supabase = createClient();
  const { data: dataSession } = await supabase.auth.getSession();
  const { url, config } = req;
  const baseUrl = getUrl();
  return axios(`${baseUrl}${url}`, {
    ...config,
    ...(dataSession && {
      headers: {
        Authorization: `Bearer ${dataSession.session?.access_token}`,
        RefreshToken: dataSession.session?.refresh_token ?? "",
      },
    }),
  });
};

export default client;
