'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const useIsAccessingAnotherWorkspace = () => {
  const searchParams = useSearchParams();
  const next = searchParams?.get('next') ?? '/redirect_to_workspace';

  //This boolean can be used to determine if the user is in the login because he wants to access another existing (or not existing actually) workspace
  //or if he is trying to login on its own
  const isAccessingAnotherWorkspace = next !== '/redirect_to_workspace';
  return isAccessingAnotherWorkspace;
};

export default useIsAccessingAnotherWorkspace;
