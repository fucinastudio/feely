import { NextRequest, NextResponse } from 'next/server';

import {
  addTopic,
  getTopicsByWorkspaceName,
  patchTopic,
  removeTopic,
} from '@/app/api/apiServerActions/topicApiServerActions';
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

  const topics = await getTopicsByWorkspaceName({
    workspaceName: org,
    access_token: user.accessToken,
  });

  return NextResponse.json(
    { isSuccess: topics.isSuccess, topics: topics.data },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized user' }, { status: 401 });
  }
  const body = await req.json();
  const { data } = body;
  const res = await addTopic({ ...data, access_token: user.accessToken });

  if (res.isSuccess) {
    return NextResponse.json(
      { message: 'Topic created', id: res.id },
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
  const res = await patchTopic({ ...data, access_token: user.accessToken });

  if (res.isSuccess) {
    return NextResponse.json(
      { message: 'Topic updated', id: res.id },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json(
      { isSuccess: false, message: 'Unauthorized user' },
      { status: 401 }
    );
  }
  const body = await req.json();
  const { data } = body;
  const res = await removeTopic({ ...data, access_token: user.accessToken });

  if (res.isSuccess) {
    return NextResponse.json(
      { isSuccess: true, message: 'Topic removed', id: res.id },
      { status: 200 }
    );
  }
  return NextResponse.json(
    { isSuccess: false, message: res.error },
    { status: 400 }
  );
}
