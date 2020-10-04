export const presets = {
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

export const frameTiming = 1000 / 60;

export function isApproximatelyEqual(v1: number, v2: number, epsilon: number) {
  return Math.abs(v1 - v2) < epsilon;
}

export function lerp(from: number, to: number, fraction: number) {
  return (to - from) * fraction + from;
}
