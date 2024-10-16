import { redirect } from "next/navigation";
import type { Metadata } from "next";

import protectRoute from "@/utils/protectedRoute";
import { getWorkspaceByName } from "@/app/api/apiServerActions/workspaceApiServerActions";

export interface IPropsDynamicRoute {
  params: {
    org: string;
  };
}

const InsideOrg = async ({ params: { org } }: IPropsDynamicRoute) => {
  await protectRoute(`/${org}`);
  redirect(`/${org}/ideas`);
};

export default InsideOrg;
