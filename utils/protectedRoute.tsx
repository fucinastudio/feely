import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

const protectRoute = async (redirectNext: string = '') => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/login${redirectNext ? `?next=${redirectNext}` : ''}`);
  }
  return user;
};
export default protectRoute;
