import { extend } from "@pixi/react";
import { Graphics, Text } from "pixi.js";
import { useMemo } from "react";

import { SCALE_BAR_MARGIN, SCALE_BAR_TEXT_OFFSET } from "../../pixi/constants";
import { drawScaleBar, pickScaleBarLength } from "../../pixi/renderScaleBar";

import { TextStyle } from "./textStyle";

extend({ Graphics, Text });

export function ScaleBar({ width, height, zoom }: { width: number; height: number; zoom: number }) {
  const { worldLength, screenLength } = useMemo(() => pickScaleBarLength(zoom), [zoom]);

  const draw = useMemo(
    () => (g: Graphics) => drawScaleBar(g, width, height, screenLength),
    [width, height, screenLength]
  );

  return (
    <>
      <pixiGraphics draw={draw} />
      <pixiText
        text={`${worldLength}`}
        x={width - SCALE_BAR_MARGIN - screenLength / 2}
        y={height - SCALE_BAR_MARGIN - SCALE_BAR_TEXT_OFFSET}
        anchor={0.5}
        style={TextStyle}
      />
    </>
  );
}
