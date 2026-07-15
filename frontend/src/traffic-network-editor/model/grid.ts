export const GRID_SIZE = 20;
export const MIN_FINE_SPACING_PX = 6;

export const GRID_MAJOR_EVERY = 5;

export function getEffectiveGridSize(zoom: number) {
  const fineSpacingPx = GRID_SIZE * zoom;
  return fineSpacingPx >= MIN_FINE_SPACING_PX ? GRID_SIZE : GRID_SIZE * GRID_MAJOR_EVERY;
}

export function isFineGridVisible(zoom: number) {
  return getEffectiveGridSize(zoom) === GRID_SIZE;
}
