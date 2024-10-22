"use server";

import { NextRequest, NextResponse } from "next/server";

import { getUserById } from "@/app/api/apiServerActions/userApiServerActions";
import { authenticateUser } from "@/app/api/apiUtils";

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  const userId = searchParams.get("userId");
  if (!workspaceId || !userId) {
    return NextResponse.json(
      { message: "Missing parameters" },
      { status: 400 }
    );
  }
  const res = await getUserById({
    workspaceId: workspaceId,
    userId: userId,
    access_token: user.accessToken,
  });

  if (res.isSuccess) {
    return NextResponse.json(
      { message: "User retrieved", user: res.data?.user },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
