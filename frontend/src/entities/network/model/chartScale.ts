// Picks a Y-axis ceiling that rescales with the data and rounds it up.
const NICE_STEP = 500;
const HEADROOM = 1.2;

export function niceYMax(peak: number): number {
  const target = Math.max(peak, 0) * HEADROOM;

  return Math.max(NICE_STEP, Math.ceil(target / NICE_STEP) * NICE_STEP);
}
