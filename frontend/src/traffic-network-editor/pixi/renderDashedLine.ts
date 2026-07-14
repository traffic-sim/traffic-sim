import type { Graphics } from "pixi.js";

export function drawDashedLine(
  graphics: Graphics,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dashLength: number,
  gapLength: number,
  color: number,
  alpha: number,
  width = 0.8
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);

  if (length === 0) {
    return;
  }

  const ux = dx / length;
  const uy = dy / length;
  const step = dashLength + gapLength;

  let dist = 0;

  while (dist < length) {
    const segEnd = Math.min(dist + dashLength, length);

    graphics.moveTo(x1 + ux * dist, y1 + uy * dist).lineTo(x1 + ux * segEnd, y1 + uy * segEnd);
    dist += step;
  }

  graphics.stroke({ width, color, alpha });
}
