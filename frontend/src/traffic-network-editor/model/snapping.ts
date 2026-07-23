import type { RoadNode } from "../../entities/network";

import { type SnapResult, SnapType } from "./SnapResult";

export function resolveSnap(
  worldX: number,
  worldY: number,
  nodes: Record<string, RoadNode>,
  endpointRadius: number,
  gridSize: number
): SnapResult {
  let nearestNode: RoadNode | null = null;
  let nearestDist = Infinity;

  for (const n of Object.values(nodes)) {
    const d = Math.hypot(n.position.x - worldX, n.position.y - worldY);

    if (d <= endpointRadius && d < nearestDist) {
      nearestDist = d;
      nearestNode = n;
    }
  }

  if (nearestNode) {
    return {
      x: nearestNode.position.x,
      y: nearestNode.position.y,
      type: SnapType.Endpoint,
      nodeId: nearestNode.id,
    };
  }

  return {
    x: Math.round(worldX / gridSize) * gridSize,
    y: Math.round(worldY / gridSize) * gridSize,
    type: SnapType.Grid,
    nodeId: null,
  };
}
