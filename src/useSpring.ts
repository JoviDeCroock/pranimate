import { Ref } from 'preact';
import { useState, useLayoutEffect, useRef } from 'preact/hooks';

interface UseSpringProps {
  lazy?: boolean;
  from?: number;
  to: number;
  property: string;
  duration: number;
  getValue?: (value: number) => string;
  infinite?: boolean;
}

const lerp = (from: number, to: number, fraction: number) =>
  (to - from) * fraction + from;

export const useSpring = ({
  from: propsFrom,
  to,
  duration,
  getValue,
  property,
  infinite,
  lazy,
}: UseSpringProps): [Ref<HTMLElement>, (activated: boolean) => void] => {
  const from = propsFrom || 0;
  const [activated, setActivated] = useState(!lazy);
  const [reverse, setReverse] = useState(false);
  const ref = useRef<HTMLElement>();
  const value = useRef(from);
  const timeoutId = useRef<any>();
  const intervalId = useRef<any>();

  useLayoutEffect(() => {
    if (activated) {
      const target = reverse ? from : to;
      const tick = Math.abs(from - to) / duration;
      intervalId.current = setInterval(() => {
        value.current = lerp(value.current, target, tick);
        requestAnimationFrame(() => {
          // @ts-ignore
          ref.current.style[property] = getValue
            ? getValue(value.current)
            : value.current;
        });
      }, tick);

      timeoutId.current = setTimeout(() => {
        clearInterval(intervalId.current);
        intervalId.current = null;
        requestAnimationFrame(() => {
          // @ts-ignore
          ref.current.style[property] = getValue ? getValue(target) : target;
          if (infinite) {
            setReverse(!reverse);
            value.current = reverse ? from : to;
          }
        });
      }, duration);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }

      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    };
  }, [reverse, activated]);

  return [ref, setActivated];
};
