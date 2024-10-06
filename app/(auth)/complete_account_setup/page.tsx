'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { Button, Separator, Card } from '@fucina/ui';
import { useCreateWorkspace } from '@/app/api/controllers/workspaceController';

const CompleteAccountSetup = () => {
  const searchParams = useSearchParams();
  const workspace = searchParams?.get('workspace');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createWorkspaceFunction } = useCreateWorkspace();
  if (!workspace) {
    return <div>Missing workspace parameter</div>;
  }

  const handleCreateWorkspace = async (workspace: string) => {
    try {
      const res = await createWorkspaceFunction(workspace);
      console.log('Res', res);
      if (!res.data.name) {
        setError(res.data.message ?? null);
      } else {
        router.push(`/${res.data.name}`);
      }
    } catch (e: any) {
      console.log('Error', e);
    }
  };

  return (
    <>
      <Card className="relative z-30 flex flex-col space-y-6 p-6 sm:p-10 max-w-[400px]">
        {error && <div>{error}</div>}
        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="text-heading-section">
            Everything is <span className="brand-gradient">ready</span>
          </h1>
          <p className="text-description text-md">
            It took a while, but now everything is ready. Start listening to
            your users.
          </p>
        </div>
        <Separator />
        <div className="w-full">
          <Button
            onClick={() => handleCreateWorkspace(workspace)}
            variant="primary"
            className="w-full h-10 button-brand"
          >
            Get started
          </Button>
        </div>
      </Card>
    </>
  );
};

export default CompleteAccountSetup;
