'use server';

import { NextRequest, NextResponse } from 'next/server';

import {
  getIdeaById,
  patchIdea,
} from '@/app/api/apiServerActions/ideaApiServerActions';
import { authenticateUser } from '@/app/api/apiUtils';

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { message: 'Idea id is required' },
      { status: 400 }
    );
  }
  const res = await getIdeaById({ ideaId: id, access_token: user.accessToken });

  if (res.isSuccess) {
    return NextResponse.json(
      { message: 'Idea retrieved', idea: res.data },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
  }
  const body = await req.json();
  const { data } = body;
  const res = await patchIdea({ ...data, access_token: user.accessToken });

  if (res.isSuccess) {
    return NextResponse.json({ message: 'Changes applied' }, { status: 200 });
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
