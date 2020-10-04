import { Ref } from 'preact';
import { useState, useLayoutEffect, useRef } from 'preact/hooks';
import { presets, frameTiming, lerp, isApproximatelyEqual } from './constants';

export interface UseSpringProps {
  lazy?: boolean;
  from?: number;
  to: number;
  property: string;
  getValue?: (value: number) => string;
  infinite?: boolean;
  preset?: 'wobbly' | 'noWobble' | 'stiff';
}

export const useSpring = ({
  from: propsFrom,
  to,
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
  const intervalId = useRef<any>();

  useLayoutEffect(() => {
    if (activated) {
      let i = 0;

      intervalId.current = setInterval(() => {
        requestAnimationFrame(() => {
          value.current = lerp(
            reverse ? to : from,
            reverse ? from : to,
            presets[preset || 'noWobble'](++i / 100)
          );

          // @ts-ignore
          ref.current.style[property] = getValue
            ? getValue(value.current)
            : value.current;
        });

        if (isApproximatelyEqual(value.current, reverse ? from : to, 0.01)) {
          clearInterval(intervalId.current);
          intervalId.current = null;
          value.current = reverse ? from : to;

          if (infinite) {
            setReverse(!reverse);
          }
        }
      }, frameTiming);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [reverse, activated]);

  return [ref, setActivated];
};
