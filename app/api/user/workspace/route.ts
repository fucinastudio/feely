'use server';

import { NextRequest, NextResponse } from 'next/server';

import { getUsersForWorkspace } from '@/app/api/apiServerActions/userApiServerActions';
import { authenticateUser } from '@/app/api/apiUtils';
import { PeriodType } from '@/types/enum/period';

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json(
      { isSuccess: false, message: 'Unauthorized user' },
      { status: 401 }
    );
  }
  const { searchParams } = new URL(req.url);

  const res = await getUsersForWorkspace({
    workspaceName: searchParams.get('workspaceName') ?? null,
    workspaceId: searchParams.get('workspaceId') ?? null,
    period: (searchParams.get('period') as PeriodType) ?? null,
    access_token: user.accessToken,
  });

  if (res.isSuccess) {
    return NextResponse.json(
      { isSuccess: res.isSuccess, usersInWorkspace: res.data?.users },
      { status: 200 }
    );
  }
  return NextResponse.json(
    { isSuccess: false, message: res.error },
    { status: 400 }
  );
}
