import { Ref } from 'preact';
import { useState, useLayoutEffect, useRef, useCallback } from 'preact/hooks';
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
}: UseSpringProps): [
  Ref<HTMLElement>,
  (activated: boolean) => void,
  () => void
] => {
  const from = propsFrom || 0;

  const [activated, setActivated] = useState(!lazy);
  const [reverse, setReverse] = useState(false);

  const ref = useRef<HTMLElement>();
  const animationRef = useRef<any>(null);
  const value = useRef(from);
  const counter = useRef(0);
  const isPlaying = useRef(false);

  const update = useCallback(() => {
    animationRef.current = requestAnimationFrame(() => {
      counter.current = counter.current + 1;
      value.current = lerp(
        reverse ? to : from,
        reverse ? from : to,
        presets[preset || 'noWobble']((counter.current * (velocity || 1)) / 200)
      );

      if (isApproximatelyEqual(value.current, reverse ? from : to, 0.01)) {
        value.current = reverse ? from : to;
        counter.current = 0;
        animationRef.current = null;

        if (infinite) {
          setReverse(!reverse);
        } else {
          isPlaying.current = false;
        }
      } else {
        // @ts-ignore
        ref.current.style[property] = getValue
          ? getValue(value.current)
          : value.current;

        update();
      }
    });
  }, [infinite, from, to, preset, property, reverse, velocity, getValue]);

  const play = useCallback(() => {
    if (isPlaying.current && animationRef.current) {
      counter.current = 0;
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    isPlaying.current = true;
    update();
  }, [update]);

  useLayoutEffect(() => {
    if (activated) {
      play();
    }

    return () => {
      if (activated) {
        counter.current = 0;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      }
    };
  }, [activated, play]);

  return [ref, setActivated, play];
};
