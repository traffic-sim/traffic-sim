import type { Graphics } from "pixi.js";

import type { Vec2 } from "../../entities/Vec2";
import { type Camera, worldToScreen } from "../model/camera";

import { COLORS, PREVIEW_LINE_ALPHA, PREVIEW_LINE_WIDTH } from "./constants";

export function renderPreviewLine(
  graphics: Graphics,
  fromWorld: Vec2 | null,
  toWorld: Vec2 | null,
  camera: Camera
) {
  graphics.clear();

  if (!fromWorld || !toWorld) {
    return;
  }

  const from = worldToScreen(fromWorld.x, fromWorld.y, camera);
  const to = worldToScreen(toWorld.x, toWorld.y, camera);

  graphics
    .moveTo(from.x, from.y)
    .lineTo(to.x, to.y)
    .stroke({ width: PREVIEW_LINE_WIDTH, color: COLORS.drawPreview, alpha: PREVIEW_LINE_ALPHA });
}
