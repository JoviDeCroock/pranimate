import { useState, useLayoutEffect, useCallback } from 'preact/hooks';

export interface UseMountUnmountArguments {
  mountingClass: string;
  unmountingClass: string;
  duration: number;
  lazy?: boolean;
}

export type UseMountUnmountValues = [string, boolean, () => void, () => void];

export const useMountUnmount = ({
  mountingClass,
  unmountingClass,
  duration,
  lazy,
}: UseMountUnmountArguments): UseMountUnmountValues => {
  const [mounted, setMounted] = useState(!lazy);
  const [isMounting, setIsMounting] = useState(!lazy);
  const [isUnmounting, setIsUnmounting] = useState(false);

  const unmount = useCallback(() => {
    setIsUnmounting(true);
    setTimeout(() => {
      setIsUnmounting(false);
      setMounted(false);
    }, duration);
  }, []);

  const mount = useCallback(() => {
    setIsMounting(true);
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (isMounting === true) {
      const timeoutId = setTimeout(() => {
        setIsMounting(false);
        (timeoutId as any) = null;
      }, duration);

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [isMounting]);

  return [
    isMounting ? mountingClass : isUnmounting ? unmountingClass : '',
    mounted,
    mount,
    unmount,
  ];
};
