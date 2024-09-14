import { redirect } from 'next/navigation';

import { getWorkspaceByUser } from '@/app/api/apiServerActions/workspaceApiServerActions';
import protectRoute from '@/utils/protectedRoute';

const RedirectToWorkspace = async () => {
  await protectRoute('/redirect_to_workspace');

  const currentWorkspace = await getWorkspaceByUser();

  if (!currentWorkspace.isSuccess) {
    return redirect('/signup');
  }
  return redirect(`/${currentWorkspace.workspace?.name}/ideas`);
};

export default RedirectToWorkspace;
