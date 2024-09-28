import React from 'react';

import WorkspaceInputField from '@/components/auth/workspace';

const Signup = async () => {
  return (
    <div className="relative z-30 flex flex-col justify-center items-center gap-10 p-5 sm:p-6">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="font-semibold text-5xl text-left sm:text-center leading-tight">
          Welcome to <span className="brand-gradient">Feely</span>
        </h1>
        <p className="w-full text-description text-left text-md sm:text-center">
          Let&apos;s start by seting up your company.
        </p>
      </div>
      <WorkspaceInputField />
    </div>
  );
};

export default Signup;
