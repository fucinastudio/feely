import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

//Usage from client
export async function POST(req: NextRequest) {
  const { workspaceName } = await req.json();

  if (!workspaceName) {
    return NextResponse.json(
      { message: 'Workspace name is required' },
      { status: 400 }
    );
  }

  const workspaceExists = await prisma.workspace.findFirst({
    where: {
      name: workspaceName,
    },
  });

  return NextResponse.json({ exists: !!workspaceExists }, { status: 200 });
}
