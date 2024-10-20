import { NextRequest, NextResponse } from "next/server";

import { authenticateUser } from "@/app/api/apiUtils";
import { getUserWorkspaces } from "@/app/api/apiServerActions/workspaceApiServerActions";

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
  }
  const res = await getUserWorkspaces({
    access_token: user.accessToken,
  });

  if (res.isSuccess) {
    return NextResponse.json(
      {
        message: "Workspaces retrieved",
        workspaces: res.data,
      },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
