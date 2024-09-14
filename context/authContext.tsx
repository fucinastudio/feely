'use client';

import { createContext, ReactNode, useContext } from 'react';

import { useGetUser } from '@/app/api/controllers/userController';
import { UserType } from '@/types/user';
import { useWorkspace } from '@/context/workspaceContext';

interface IAuthContext {
  isAdmin: boolean;
  user: UserType | null;
}

// Create the AuthContext with default values
const AuthContext = createContext<IAuthContext | undefined>(undefined);

AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { org } = useWorkspace();

  const { data } = useGetUser({
    current_org: org,
  });

  //Get the user from the server

  return (
    <AuthContext.Provider
      value={{
        isAdmin: data?.data.isAdmin ?? false,
        user: data?.data.user ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
