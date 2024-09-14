import React, { useEffect, useState } from "react";

const useDebounce = (delay: number = 1000) => {
  const [mainState, setMainState] = useState<string>("");

  const [slaveState, setSlaveState] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setMainState(slaveState);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [slaveState]);
  return { mainState, slaveState, setSlaveState };
};

export default useDebounce;
