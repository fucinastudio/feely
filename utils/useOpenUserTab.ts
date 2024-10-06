import { useAuth } from '@/context/authContext';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

interface IProps {
  userId: string | null;
}

const useOpenUserTab = ({ userId }: IProps) => {
  const pathName = usePathname();

  const searchParams = useSearchParams();

  const userPageLink = useMemo(() => {
    const newSearchParams = new URLSearchParams(searchParams || '');
    if (userId) {
      newSearchParams.set('user', userId);
    }

    return `${pathName}?${newSearchParams.toString()}`;
  }, [searchParams, pathName, userId]);
  return userPageLink;
};

export default useOpenUserTab;
