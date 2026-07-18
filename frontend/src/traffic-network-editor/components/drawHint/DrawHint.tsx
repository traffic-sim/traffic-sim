import type { Vec2 } from "../../../entities/Vec2";

import { TextStyle } from "./textStyle";

export function DrawHint({ position, hasStart }: { position: Vec2; hasStart: boolean }) {
  const text = hasStart ? "Click to connect · Esc to cancel" : "Click to start a road";
  return <pixiText text={text} x={position.x + 14} y={position.y + 14} style={TextStyle} />;
}
