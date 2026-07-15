import type { Graphics } from "pixi.js";

import { type Camera, worldToScreen } from "../model/camera";
import { type SnapResult, SnapType } from "../model/SnapResult";

import { SNAP_INDICATOR_COLOR } from "./constants";

export function drawSnapIndicator(graphics: Graphics, snap: SnapResult | null, camera: Camera) {
  graphics.clear();

  if (!snap || snap.type === SnapType.None) {
    return;
  }

  const p = worldToScreen(snap.x, snap.y, camera);

  if (snap.type === SnapType.Endpoint) {
    graphics.circle(p.x, p.y, 11).stroke({ width: 1.5, color: SNAP_INDICATOR_COLOR, alpha: 0.8 });
    return;
  }

  const s = 6;
  graphics.moveTo(p.x - s, p.y).lineTo(p.x + s, p.y);
  graphics.moveTo(p.x, p.y - s).lineTo(p.x, p.y + s);
  graphics.stroke({ width: 1.2, color: SNAP_INDICATOR_COLOR, alpha: 0.7 });
}
