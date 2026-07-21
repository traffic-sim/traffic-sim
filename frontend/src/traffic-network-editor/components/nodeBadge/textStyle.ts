import { BADGE_FONT_SIZE, COLORS } from "../../pixi/constants";

export const TextStyle = {
  fontSize: BADGE_FONT_SIZE,
  fill: COLORS.badgeText,
  fontFamily: "IBM Plex Mono, ui-monospace, monospace",
  fontWeight: "bold" as const,
  resolution: window.devicePixelRatio || 1,
};
