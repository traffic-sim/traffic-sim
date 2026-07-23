import { BADGE_PLATE_RADIUS, NODE_RADIUS } from "../../pixi/constants";

export function calculateBadgeY(y: number) {
  return y - NODE_RADIUS - BADGE_PLATE_RADIUS - 4;
}
