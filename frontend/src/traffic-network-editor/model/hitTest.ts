import type { RoadNode } from "../../entities/network";

import { HIT_RADIUS } from "./constants";

export function findNodeAt(nodes: RoadNode[], x: number, y: number): string | null {
  for (const n of nodes) {
    const dx = n.x - x;
    const dy = n.y - y;
    if (dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS) {
      return n.id;
    }
  }
  return null;
}
