'use server';

import { NextRequest, NextResponse } from 'next/server';

import { getUser } from '@/app/api/apiServerActions/userApiServerActions';
import { authenticateUser } from '@/app/api/apiUtils';

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);

  const res = await getUser({
    current_org: searchParams.get('org') ?? undefined,
    check_option: 'name',
    access_token: user.accessToken,
  });

  if (res.isSuccess) {
    return NextResponse.json(
      {
        message: 'User retrieved',
        user: res.data?.user,
        isAdmin: res.data?.isAdmin,
      },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
