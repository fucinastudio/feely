import { AxiosError } from "axios";

export type FeelyError = AxiosError<{
  isSuccess: boolean;
  message?: string | null;
}>;
