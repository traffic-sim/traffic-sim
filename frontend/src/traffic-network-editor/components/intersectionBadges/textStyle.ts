import { COLORS, INTERSECTION_BADGE_FONT_SIZE } from "../../pixi/constants";

export const TextStyle = {
  fontSize: INTERSECTION_BADGE_FONT_SIZE,
  fill: COLORS.intersectionBadge,
  fontFamily: "IBM Plex Mono, ui-monospace, monospace",
  fontWeight: "bold" as const,
};
