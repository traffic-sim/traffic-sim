import type { Graphics } from "pixi.js";

import type { Camera } from "../model/camera";
import { GRID_MAJOR_EVERY, GRID_SIZE, isFineGridVisible } from "../model/grid";

import { COLORS } from "./constants";

export function drawGrid(g: Graphics, width: number, height: number, camera: Camera) {
  g.clear();

  g.rect(0, 0, width, height).fill({ color: COLORS.background, alpha: 0 });

  const step = GRID_SIZE * camera.zoom;
  const majorStep = step * GRID_MAJOR_EVERY;

  const originX = -camera.x * camera.zoom;
  const originY = -camera.y * camera.zoom;

  if (isFineGridVisible(camera.zoom)) {
    const firstX = originX % step;
    const firstY = originY % step;

    for (let x = firstX; x <= width; x += step) {
      g.moveTo(Math.round(x) + 0.5, 0).lineTo(Math.round(x) + 0.5, height);
    }

    for (let y = firstY; y <= height; y += step) {
      g.moveTo(0, Math.round(y) + 0.5).lineTo(width, Math.round(y) + 0.5);
    }

    g.stroke({ width: 1, color: COLORS.gridFine });
  }

  const firstMajorX = originX % majorStep;
  const firstMajorY = originY % majorStep;

  for (let x = firstMajorX; x <= width; x += majorStep) {
    g.moveTo(Math.round(x) + 0.5, 0).lineTo(Math.round(x) + 0.5, height);
  }

  for (let y = firstMajorY; y <= height; y += majorStep) {
    g.moveTo(0, Math.round(y) + 0.5).lineTo(width, Math.round(y) + 0.5);
  }

  g.stroke({ width: 1, color: COLORS.gridMajor });
}
