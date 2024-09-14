'use server';

import { NextRequest, NextResponse } from 'next/server';

import { IGetIdeasByUserInWorkspace } from '@/app/api/controllers/ideaController';
import { getIdeasByUserInWorkspace } from '@/app/api/apiServerActions/ideaApiServerActions';
import {
  authenticateUser,
  fromUrlSearchParamsToObject,
} from '@/app/api/apiUtils';

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const { userId, workspaceId } =
    fromUrlSearchParamsToObject<IGetIdeasByUserInWorkspace>(searchParams);
  if (!workspaceId) {
    return NextResponse.json(
      { message: 'Workspace id is required' },
      { status: 400 }
    );
  }
  const res = await getIdeasByUserInWorkspace({
    userId,
    workspaceId,
    access_token: user.accessToken,
  });

  if (res.isSuccess) {
    return NextResponse.json(
      { message: 'Ideas retrieved', ideas: res.data },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
