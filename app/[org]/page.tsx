import { redirect } from "next/navigation";
import type { Metadata } from "next";

import protectRoute from "@/utils/protectedRoute";
import { getWorkspaceByName } from "@/app/api/apiServerActions/workspaceApiServerActions";

export interface IPropsDynamicRoute {
  params: {
    org: string;
  };
}

async function getOrgData(org: string) {
  const workspace = await getWorkspaceByName(org);
  if (!workspace) {
    throw new Error("Not found");
  }
  return { name: workspace?.externalName || org };
}

export async function generateMetadata({
  params,
}: {
  params: { org: string };
}): Promise<Metadata> {
  console.log("Params", params);
  const org = await getOrgData(params.org);
  return {
    title: `${org.name}`,
  };
}

const InsideOrg = async ({ params: { org } }: IPropsDynamicRoute) => {
  await protectRoute(`/${org}`);
  redirect(`/${org}/ideas`);
};

export default InsideOrg;
