"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useGetUser } from "@/app/api/controllers/userController";
import { UserType } from "@/types/user";
import { useWorkspace } from "@/context/workspaceContext";

interface IAuthContext {
  isAdmin: boolean;
  user: UserType | null;
  isLoading: boolean;
}

// Create the AuthContext with default values
const AuthContext = createContext<IAuthContext | undefined>(undefined);

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { org, isLoadingWorkspace } = useWorkspace();

  const {
    data: user,
    isLoading: isLoadingUser,
    isRefetching: isRefetchingUser,
  } = useGetUser({
    current_org: org,
  });

  const [randomNumber, setRandomNumber] = useState<number>(
    Math.floor(Math.random() * 10000)
  );
  //This is needed to bypass the local cache of the browser
  useEffect(() => {
    if (!isRefetchingUser) return;
    setRandomNumber(Math.floor(Math.random() * 10000));
  }, [isRefetchingUser]);

  const userToExport = useMemo(() => {
    return user?.data.user
      ? {
          ...user?.data.user,
          image_url: user?.data.user?.image_url
            ? user.data.user.image_url + `?c=${randomNumber}`
            : "",
        }
      : null;
  }, [user, randomNumber]);

  return (
    <AuthContext.Provider
      value={{
        isAdmin: user?.data.isAdmin ?? false,
        isLoading: isLoadingUser || isLoadingWorkspace,
        user: userToExport,
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
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
