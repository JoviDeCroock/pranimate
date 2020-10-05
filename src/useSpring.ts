import { Ref } from 'preact';
import { useState, useLayoutEffect, useRef } from 'preact/hooks';
import { presets, lerp, isApproximatelyEqual } from './constants';

export interface UseSpringProps {
  lazy?: boolean;
  from?: number;
  to: number;
  property: string;
  getValue?: (value: number) => string;
  infinite?: boolean;
  preset?: 'wobbly' | 'noWobble' | 'stiff';
  velocity?: number;
}

export const useSpring = ({
  from: propsFrom,
  to,
  getValue,
  property,
  infinite,
  lazy,
  preset,
  velocity,
}: UseSpringProps): [Ref<HTMLElement>, (activated: boolean) => void] => {
  const from = propsFrom || 0;

  const [activated, setActivated] = useState(!lazy);
  const [reverse, setReverse] = useState(false);

  const ref = useRef<HTMLElement>();
  const animationRef = useRef<any>(null);
  const value = useRef(from);

  useLayoutEffect(() => {
    if (activated) {
      let i = 0;

      const update = () =>
        (animationRef.current = requestAnimationFrame(() => {
          value.current = lerp(
            reverse ? to : from,
            reverse ? from : to,
            presets[preset || 'noWobble']((++i * (velocity || 1)) / 100)
          );

          // @ts-ignore
          ref.current.style[property] = getValue
            ? getValue(value.current)
            : value.current;

          if (isApproximatelyEqual(value.current, reverse ? from : to, 0.01)) {
            value.current = reverse ? from : to;

            if (infinite) {
              setReverse(!reverse);
            }
          } else {
            animationRef.current = null;
            update();
          }
        }));

      update();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [reverse, activated, infinite, property, preset, from, to, getValue]);

  return [ref, setActivated];
};
