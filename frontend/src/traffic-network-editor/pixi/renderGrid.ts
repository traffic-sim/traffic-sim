import type { Graphics } from "pixi.js";

import type { Camera } from "../model/camera";
import { GRID_MAJOR_EVERY, GRID_SIZE, isFineGridVisible } from "../model/grid";

import { COLORS } from "./constants";

export function drawGrid(g: Graphics, width: number, height: number, camera: Camera) {
  g.clear();

  const step = GRID_SIZE * camera.zoom;
  const majorStep = step * GRID_MAJOR_EVERY;

  const originX = -camera.x * camera.zoom;
  const originY = -camera.y * camera.zoom;

  if (isFineGridVisible(camera.zoom)) {
    const firstX = originX % step;
    const firstY = originY % step;

    strokeGridLines(g, width, height, firstX, firstY, step, COLORS.gridFine);
  }

  const firstMajorX = originX % majorStep;
  const firstMajorY = originY % majorStep;

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
    g.moveTo(Math.round(x) + 0.5, 0).lineTo(Math.round(x) + 0.5, height);
  }

  for (let y = firstY; y <= height; y += step) {
    g.moveTo(0, Math.round(y) + 0.5).lineTo(width, Math.round(y) + 0.5);
  }

  g.stroke({ width: 1, color });
}
