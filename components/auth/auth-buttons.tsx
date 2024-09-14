'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { createClient } from '@/utils/supabase/client';
import { Button } from '@fucina/ui';
import {
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
} from '@/components/social-icons';

const AuthButtons = () => {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/redirect_to_workspace';
  const workspace = searchParams.get('workspace');
  //If only one of next and workspace use that, otherwise concat with &
  const redirectString =
    next && workspace
      ? `?next=${next}&workspace=${workspace}`
      : next
      ? `?next=${next}`
      : workspace
      ? `?workspace=${workspace}`
      : '';
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback${redirectString}`,
      },
    });
    if (data.url) {
      try {
        return redirect(data.url);
      } catch (e) {
        console.log('Error redirect:', e);
      }
    }
    if (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleGoogleLogin}>
        <div className="flex flex-col space-y-2 w-full">
          <Button variant="secondary" className="w-full h-10">
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button disabled variant="secondary" className="w-full h-10">
            <GithubIcon />
            Continue with Github
          </Button>
          <Button disabled variant="secondary" className="w-full h-10">
            <FacebookIcon />
            Continue with Facebook
          </Button>
        </div>
      </form>
      {/* <form onSubmit={handleLoginUserPass} className="flex flex-col gap-4 mt-4">
        <input
          type="text"
          placeholder="Username"
          name="userName"
          className="px-4 py-2 border rounded-md text-black"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="px-4 py-2 border rounded-md text-black"
        />
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded-md text-white">
          LogIn
        </button>
      </form> */}
    </>
  );
};
export default AuthButtons;
