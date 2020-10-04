import { Ref } from 'preact';
import { useState, useLayoutEffect, useRef } from 'preact/hooks';

export interface UseSpringProps {
  lazy?: boolean;
  from?: number;
  to: number;
  property: string;
  duration: number;
  getValue?: (value: number) => string;
  infinite?: boolean;
  preset?: 'wobbly' | 'noWobble' | 'stiff';
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
  preset,
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
      const start = reverse ? to : from;
      const target = reverse ? from : to;
      const tick = Math.abs(from - to) / duration;
      let i = 0;
      intervalId.current = setInterval(() => {
        i++;
        value.current = lerp(
          start,
          target,
          presets[preset || 'noWobble'](i / 100)
        );

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

const presets = {
  noWobble: (t: number) =>
    2.71828 ** (-13 * t) *
    (2.71828 ** (13 * t) - 13 * Math.sin(t) - Math.cos(t)),
  wobbly: (t: number) =>
    -0.5 *
    2.71828 ** (-6 * t) *
    (-2 * 2.71828 ** (6 * t) + Math.sin(12 * t) + 2 * Math.cos(12 * t)),
  stiff: (t: number) =>
    Math.sqrt(10 / 11) * 2.71828 ** (-10 * t) * Math.sin(Math.sqrt(110) * t) -
    2.71828 ** (-10 * t) * Math.cos(Math.sqrt(110) * t) +
    1,
};
