import { NextRequest, NextResponse } from "next/server";

import {
  getWorkspaceByName,
  patchWorkspace,
} from "@/app/api/apiServerActions/workspaceApiServerActions";
import { authenticateUser } from "@/app/api/apiUtils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const org = searchParams.get("org");
  if (!org) {
    return NextResponse.json(
      { message: "Workspace name is required" },
      { status: 400 }
    );
  }

  const workspace = await getWorkspaceByName(org, true, true);

  return NextResponse.json({ isSuccess: true, workspace }, { status: 200 });
}

export async function PATCH(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
  }
  const body = await req.json();
  const { data } = body;
  const res = await patchWorkspace({ ...data, access_token: user.accessToken });

  if (res.isSuccess) {
    return NextResponse.json(
      { message: "Changes applied", isSuccess: res.isSuccess, org: res.org },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
