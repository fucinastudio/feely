'use server';

import { NextRequest, NextResponse } from 'next/server';

import { createWorkspace } from '@/app/api/apiServerActions/workspaceApiServerActions';
import { authenticateUser } from '@/app/api/apiUtils';

//Usage from client
export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
  }
  const body = await req.json();
  const { workspaceName } = body;
  const res = await createWorkspace(workspaceName, user.accessToken);

  console.log('Res', res);
  if (res.isSuccess) {
    return NextResponse.json(
      { message: 'Workspace created', id: res.id, name: workspaceName },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
