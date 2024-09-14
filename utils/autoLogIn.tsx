import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

const autoLogin = async () => {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();
  if (data.session) {
    return redirect(`/`);
  }
};
export default autoLogin;
