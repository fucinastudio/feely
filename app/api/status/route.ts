import { NextRequest, NextResponse } from 'next/server';

import { getStatusesByWorkspaceName } from '@/app/api/apiServerActions/statusApiServerAction';
import { authenticateUser } from '@/app/api/apiUtils';

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json(
      { isSuccess: false, message: 'Unauthorized user' },
      { status: 401 }
    );
  }
  const { searchParams } = new URL(req.url);
  const org = searchParams.get('org');
  if (!org) {
    return NextResponse.json(
      { isSuccess: false, message: 'Workspace name is required' },
      { status: 400 }
    );
  }

  const statuses = await getStatusesByWorkspaceName({
    workspaceName: org,
    access_token: user.accessToken,
  });

  return NextResponse.json(
    { isSuccess: statuses.isSuccess, statuses: statuses.data },
    { status: 200 }
  );
}
