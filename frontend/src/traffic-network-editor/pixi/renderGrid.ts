import type { Graphics } from "pixi.js";

import { COLORS, GRID_MAJOR_EVERY, GRID_SIZE } from "./constants";

export function drawGrid(g: Graphics, width: number, height: number) {
  g.clear();

  g.rect(0, 0, width, height).fill({ color: COLORS.background, alpha: 0 });

  for (let x = 0; x <= width; x += GRID_SIZE) {
    g.moveTo(x + 0.5, 0).lineTo(x + 0.5, height);
  }

  for (let y = 0; y <= height; y += GRID_SIZE) {
    g.moveTo(0, y + 0.5).lineTo(width, y + 0.5);
  }

  g.stroke({ width: 1, color: COLORS.gridFine });

  const major = GRID_SIZE * GRID_MAJOR_EVERY;

  for (let x = 0; x <= width; x += major) {
    g.moveTo(x + 0.5, 0).lineTo(x + 0.5, height);
  }

  for (let y = 0; y <= height; y += major) {
    g.moveTo(0, y + 0.5).lineTo(width, y + 0.5);
  }

  g.stroke({ width: 1, color: COLORS.gridMajor });
}
