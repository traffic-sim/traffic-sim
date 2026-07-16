import type { Graphics } from "pixi.js";

import { type Camera, worldToScreen } from "../model/camera";
import { type SnapResult, SnapType } from "../model/SnapResult";

import {
  COLORS,
  SNAP_CROSSHAIR_SIZE,
  SNAP_ENDPOINT_ALPHA,
  SNAP_ENDPOINT_RADIUS,
  SNAP_ENDPOINT_STROKE_WIDTH,
  SNAP_GRID_ALPHA,
  SNAP_GRID_STROKE_WIDTH,
} from "./constants";

export function drawSnapIndicator(graphics: Graphics, snap: SnapResult | null, camera: Camera) {
  graphics.clear();

  if (!snap || snap.type === SnapType.None) {
    return;
  }

  const p = worldToScreen(snap.x, snap.y, camera);

  if (snap.type === SnapType.Endpoint) {
    graphics.circle(p.x, p.y, SNAP_ENDPOINT_RADIUS).stroke({
      width: SNAP_ENDPOINT_STROKE_WIDTH,
      color: COLORS.snapIndicator,
      alpha: SNAP_ENDPOINT_ALPHA,
    });

    return;
  }

  const s = SNAP_CROSSHAIR_SIZE;

  graphics.moveTo(p.x - s, p.y).lineTo(p.x + s, p.y);
  graphics.moveTo(p.x, p.y - s).lineTo(p.x, p.y + s);

  graphics.stroke({
    width: SNAP_GRID_STROKE_WIDTH,
    color: COLORS.snapIndicator,
    alpha: SNAP_GRID_ALPHA,
  });
}
