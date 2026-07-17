import type { Graphics } from "pixi.js";

import {
  COLORS,
  SCALE_BAR_MARGIN,
  SCALE_BAR_OVERSHOOT_FACTOR,
  SCALE_BAR_STROKE_WIDTH,
  SCALE_BAR_TARGET_PX,
} from "./constants";

const NICE_STEPS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

export function pickScaleBarLength(zoom: number): { worldLength: number; screenLength: number } {
  const targetScreenPx = SCALE_BAR_TARGET_PX;
  let best = NICE_STEPS[0];

  for (const step of NICE_STEPS) {
    if (step * zoom <= targetScreenPx * SCALE_BAR_OVERSHOOT_FACTOR) {
      best = step;
    }
  }

  return { worldLength: best, screenLength: best * zoom };
}

export function drawScaleBar(
  graphics: Graphics,
  width: number,
  height: number,
  screenLength: number
) {
  graphics.clear();

  const x0 = width - SCALE_BAR_MARGIN - screenLength;
  const x1 = width - SCALE_BAR_MARGIN;
  const y = height - SCALE_BAR_MARGIN;

  graphics.moveTo(x0, y).lineTo(x1, y);
  graphics.moveTo(x0, y - 4).lineTo(x0, y + 4);
  graphics.moveTo(x1, y - 4).lineTo(x1, y + 4);

  graphics.stroke({ width: SCALE_BAR_STROKE_WIDTH, color: COLORS.scaleBar });
}
