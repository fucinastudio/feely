"use server";

import { NextRequest, NextResponse } from "next/server";

import { uploadImageForWorkspace } from "@/app/api/apiServerActions/workspaceApiServerActions";
import { authenticateUser } from "@/app/api/apiUtils";

export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
  }
  console.log("Req", req);
  const body = await req.json();
  console.log("Body", body);
  const res = await uploadImageForWorkspace({
    ...body,
    access_token: user.accessToken,
  });

  if (res.isSuccess) {
    return NextResponse.json(
      { message: "Image uploaded created", imageUrl: res.data },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
