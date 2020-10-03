import { useState, useEffect } from 'preact/hooks';

interface UseSpringProps {
  lazy?: boolean;
  from?: number;
  to: number;
  property: string;
  duration: number;
}

const lerp = (from: number, to: number, fraction: number) =>
  (to - from) * fraction + from;

export const useSpring = ({
  lazy,
  from,
  to,
  duration,
  property,
}: UseSpringProps) => {
  const [isActivated, setIsActivated] = useState(!lazy);
  const [value, setValue] = useState<number>(from || 0);

  useEffect(() => {
    if (isActivated) {
      setValue(lerp(value, to, to - (from || 0) / duration));
    }
  }, [isActivated]);

  return [{ [property]: value }, setIsActivated];
};
