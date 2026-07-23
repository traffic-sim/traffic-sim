import type { Graphics } from "pixi.js";
import { useCallback } from "react";

import { BADGE_PLATE_RADIUS } from "../../pixi/constants";

import { TextStyle } from "./textStyle";

export function NodeBadge({
  x,
  y,
  label,
  plateColor,
}: {
  x: number;
  y: number;
  label: string;
  plateColor: number;
}) {
  const drawPlate = useCallback(
    (g: Graphics) => {
      g.clear();
      g.circle(x, y, BADGE_PLATE_RADIUS).fill(plateColor);
    },
    [x, y, plateColor]
  );

  return (
    <>
      <pixiGraphics draw={drawPlate} />
      <pixiText text={label} x={x} y={y} anchor={0.5} style={TextStyle} />
    </>
  );
}
