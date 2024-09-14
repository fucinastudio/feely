import { NextRequest, NextResponse } from 'next/server';

import { patchWorkspaceSettings } from '@/app/api/apiServerActions/workspaceSettingsApiServerActions';
import { authenticateUser } from '@/app/api/apiUtils';

export async function PATCH(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
  }
  const body = await req.json();
  const { data } = body;
  const res = await patchWorkspaceSettings({
    ...data,
    access_token: user.accessToken,
  });

  if (res.isSuccess) {
    return NextResponse.json(
      {
        message: 'Changes applied',
        isSuccess: res.isSuccess,
        workspaceSettings: res.workspaceSettings,
      },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
