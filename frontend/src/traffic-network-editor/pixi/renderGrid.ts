import type { Graphics } from "pixi.js";

import type { Camera } from "../model/camera";
import { GRID_MAJOR_EVERY, GRID_SIZE, isFineGridVisible } from "../model/grid";

import { COLORS, PIXEL_ALIGNMENT } from "./constants";

export function renderGrid(g: Graphics, width: number, height: number, camera: Camera) {
  g.clear();

  const step = GRID_SIZE * camera.zoom;
  const majorStep = step * GRID_MAJOR_EVERY;

  const originX = -camera.x * camera.zoom;
  const originY = -camera.y * camera.zoom;

  if (isFineGridVisible(camera.zoom)) {
    const firstX = ((originX % step) + step) % step;
    const firstY = ((originY % step) + step) % step;

    strokeGridLines(g, width, height, firstX, firstY, step, COLORS.gridFine);
  }

  const firstMajorX = ((originX % majorStep) + majorStep) % majorStep;
  const firstMajorY = ((originY % majorStep) + majorStep) % majorStep;

  strokeGridLines(g, width, height, firstMajorX, firstMajorY, majorStep, COLORS.gridMajor);
}

function strokeGridLines(
  g: Graphics,
  width: number,
  height: number,
  firstX: number,
  firstY: number,
  step: number,
  color: number
) {
  for (let x = firstX; x <= width; x += step) {
    g.moveTo(Math.round(x) + PIXEL_ALIGNMENT, 0).lineTo(Math.round(x) + PIXEL_ALIGNMENT, height);
  }

  for (let y = firstY; y <= height; y += step) {
    g.moveTo(0, Math.round(y) + PIXEL_ALIGNMENT).lineTo(width, Math.round(y) + PIXEL_ALIGNMENT);
  }

  g.stroke({ width: 1, color });
}
