import { SetStateAction, useEffect, useState } from "react";

interface IProps<T> {
  mainState: T;
  callOnChange: (state: T) => void;
}

export const useOptimistic = <T>({
  mainState,
  callOnChange,
}: IProps<T>): [T, (value: T) => void] => {
  const [optimisticState, setOptimisticState] = useState<T>(mainState);

  useEffect(() => {
    setOptimisticState(mainState);
  }, [mainState]);

  const handleChangeOptimisticState = (value: T) => {
    callOnChange(value);
    setOptimisticState(value);
  };

  return [optimisticState, handleChangeOptimisticState];
};
