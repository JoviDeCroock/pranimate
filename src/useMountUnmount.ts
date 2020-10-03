import { useState, useLayoutEffect, useCallback } from 'preact/hooks';

interface UseMountUnmountArguments {
  mountingClass: string;
  unmountingClass: string;
  duration: number;
}

type UseMountUnmountValues = [string, boolean, () => void];

export const useMountUnmount = ({
  mountingClass,
  unmountingClass,
  duration,
}: UseMountUnmountArguments): UseMountUnmountValues => {
  const [mounted, setMounted] = useState(true);
  const [isMounting, setIsMounting] = useState(true);
  const [isUnmounting, setIsUnmounting] = useState(false);

  // Can also be attached with useImperativeHandle to the parent.
  const unmount = useCallback(() => {
    setIsUnmounting(true);
    setTimeout(() => {
      setIsUnmounting(false);
      setMounted(false);
    }, duration);
  }, []);

  useLayoutEffect(() => {
    setTimeout(() => {
      setIsMounting(false);
    }, duration);
  }, []);

  return [
    isMounting ? mountingClass : isUnmounting ? unmountingClass : '',
    mounted,
    unmount,
  ];
};
