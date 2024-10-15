import { NextRequest, NextResponse } from "next/server";

import { authenticateUser } from "@/app/api/apiUtils";
import {
  addWorkspaceAdmins,
  deleteWorkspaceAdmin,
  getWorkspaceAdmins,
} from "@/app/api/apiServerActions/workspaceApiServerActions";

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json(
      { message: "Workspace ID is required" },
      { status: 400 }
    );
  }
  const res = await getWorkspaceAdmins({
    workspaceId: workspaceId,
    access_token: user.accessToken,
  });

  if (res.isSuccess) {
    return NextResponse.json(
      {
        message: "Admins retrieved",
        admins: res.data,
      },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
  }
  const {
    data: { workspaceId, userId },
  } = await req.json();

  if (!workspaceId) {
    return NextResponse.json(
      { message: "Workspace ID is required" },
      { status: 400 }
    );
  }
  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }
  const res = await deleteWorkspaceAdmin({
    workspaceId: workspaceId,
    userId: userId,
    access_token: user.accessToken,
  });

  if (res.isSuccess) {
    return NextResponse.json(
      {
        message: "Admin deleted",
        isSuccess: true,
      },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
  }
  const {
    data: { workspaceId, emails },
  } = await req.json();

  if (!workspaceId) {
    return NextResponse.json(
      { message: "Workspace ID is required" },
      { status: 400 }
    );
  }
  if (!emails) {
    return NextResponse.json(
      { message: "Emails is required" },
      { status: 400 }
    );
  }
  const res = await addWorkspaceAdmins({
    workspaceId: workspaceId,
    emails,
    access_token: user.accessToken,
  });

  if (res.isSuccess) {
    return NextResponse.json(
      {
        message: "Admins created",
        isSuccess: true,
        count: res.count,
      },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
