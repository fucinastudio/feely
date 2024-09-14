'use server';

import { NextRequest, NextResponse } from 'next/server';

import { createIdea } from '@/app/api/apiServerActions/ideaApiServerActions';
import { authenticateUser } from '@/app/api/apiUtils';

export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
  }
  const body = await req.json();
  const { data } = body;
  const res = await createIdea(data, user.accessToken);

  if (res.isSuccess) {
    return NextResponse.json(
      { message: 'Workspace created', id: res.data },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
