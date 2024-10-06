import { useAuth } from "@/context/authContext";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";

interface IProps {
  userId: string | null;
}

const useOpenUserTab = ({ userId }: IProps) => {
  const pathName = usePathname();

  const searchParams = useSearchParams();

  const userPageLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams || "");
    if (userId) {
      newSearchParams.set("user", userId);
    }

    return `${pathName}?${newSearchParams.toString()}`;
  }, [searchParams, pathName, userId]);
  return userPageLink;
};

export const useOpenUserTabFunction = () => {
  const pathName = usePathname();

  const searchParams = useSearchParams();

  const userPageLinkFunction = useCallback(
    ({ userId }: IProps) => {
      const newSearchParams = new URLSearchParams(searchParams || "");
      if (userId) {
        newSearchParams.set("user", userId);
      }

      return `${pathName}?${newSearchParams.toString()}`;
    },
    [searchParams, pathName]
  );
  return userPageLinkFunction;
};

export default useOpenUserTab;
