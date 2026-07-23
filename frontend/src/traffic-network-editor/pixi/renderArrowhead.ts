import type { Graphics } from "pixi.js";

import type { Vec2 } from "../../entities/Vec2";

import { ARROW_BACKSTEP_RATIO, ARROW_HALF_WIDTH_RATIO, ARROW_SIZE, COLORS } from "./constants";

export function drawArrowhead(graphics: Graphics, fromScreen: Vec2, toScreen: Vec2) {
  const dx = toScreen.x - fromScreen.x;
  const dy = toScreen.y - fromScreen.y;

  const len = Math.hypot(dx, dy);

  if (len === 0) {
    return;
  }

  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;

  const mx = (fromScreen.x + toScreen.x) / 2;
  const my = (fromScreen.y + toScreen.y) / 2;

  const tipX = mx + ux * ARROW_SIZE;
  const tipY = my + uy * ARROW_SIZE;

  const baseLX =
    mx - ux * ARROW_SIZE * ARROW_BACKSTEP_RATIO + px * ARROW_SIZE * ARROW_HALF_WIDTH_RATIO;
  const baseLY =
    my - uy * ARROW_SIZE * ARROW_BACKSTEP_RATIO + py * ARROW_SIZE * ARROW_HALF_WIDTH_RATIO;
  const baseRX =
    mx - ux * ARROW_SIZE * ARROW_BACKSTEP_RATIO - px * ARROW_SIZE * ARROW_HALF_WIDTH_RATIO;
  const baseRY =
    my - uy * ARROW_SIZE * ARROW_BACKSTEP_RATIO - py * ARROW_SIZE * ARROW_HALF_WIDTH_RATIO;

  graphics.poly([tipX, tipY, baseLX, baseLY, baseRX, baseRY]).fill(COLORS.road);
}
