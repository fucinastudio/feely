import { NextRequest } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export const authenticateUser = async (req: NextRequest) => {
  const supabase = createClient();
  const accessToken = req.headers.get('Authorization')?.split('Bearer ')[1];
  const refreshToken = req.headers.get('RefreshToken');
  if (!accessToken || !refreshToken) {
    return null;
  }
  const { data, error } = await supabase.auth.getUser(accessToken ?? undefined);
  if (error) {
    return null;
  }
  return { user: data.user, accessToken, refreshToken };
};

export const fromUrlSearchParamsToObject = <T>(
  searchParams: URLSearchParams
): T => {
  const paramsObject: { [key: string]: string } = {};

  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });
  return paramsObject as T;
};

export const ensureArray = (
  value: string | string[] | undefined
): string[] | undefined => {
  if (value === undefined) return value;
  return Array.isArray(value) ? value : value.split(',');
};
