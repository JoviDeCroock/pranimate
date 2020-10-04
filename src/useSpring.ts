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
  lazy
}: UseSpringProps): [Ref<HTMLElement>, (activated: boolean) => void] => {
  const from = propsFrom || 0;
  const [activated, setActivated] = useState(!lazy);
  const [reverse, setReverse] = useState(false);
  const ref = useRef<HTMLElement>();
  const value = useRef(from);

  useLayoutEffect(() => {
    if (activated) {
      const target = reverse ? from : to;
      const tick = Math.abs(from - to) / duration;
      const intervalID = setInterval(() => {
        value.current = lerp(value.current, target, tick);
        if (value.current === target) {
          clearInterval(intervalID);
        } else {
          requestAnimationFrame(() => {
            ref.current.style[property] = getValue
              ? getValue(value.current)
              : value.current;
          });
        }
      }, tick);

      const timeoutID = setTimeout(() => {
        clearInterval(intervalID);
        requestAnimationFrame(() => {
          ref.current.style[property] = getValue(target);
          if (infinite) {
            setReverse(!reverse);
            value.current = reverse ? from : to;
            console.log("setting value to", value.current);
          }
        });
      }, duration);

      return () => {
        clearInterval(intervalID);
        clearTimeout(timeoutID);
      };
    }
  }, [reverse, activated]);

  return [ref, setActivated];
};
