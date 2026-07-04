import type { RoadNode } from "../types.ts";
import { HIT_RADIUS } from "./constants.ts";

export function findNodeAt(nodes: RoadNode[], x: number, y: number): string | null {
  for (const n of nodes) {
    const dx = n.x - x;
    const dy = n.y - y;
    if (Math.sqrt(dx * dx + dy * dy) <= HIT_RADIUS) {
      return n.id;
    }
  }
  return null;
}
