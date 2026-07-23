import type { GraphIndex } from "./graphIndex";
import type { Intersection } from "./types";

export type ArmDirection = "inbound" | "outbound";

export interface IntersectionArm {
  edgeId: string;
  direction: ArmDirection;
}

export type IntersectionKind = "chain" | "junction" | "merge" | "diverge";

export function getIntersectionKind(index: GraphIndex, nodeId: string) {
  const inbound = index.inboundCount[nodeId] ?? 0;
  const outbound = index.outboundCount[nodeId] ?? 0;

  if (inbound <= 1 && outbound <= 1) {
    return "chain";
  }
  if (inbound > 1 && outbound <= 1) {
    return "merge";
  }
  if (outbound > 1 && inbound <= 1) {
    return "diverge";
  }

  return "junction";
}

export function syncIntersections(
  index: GraphIndex,
  intersections: Record<string, Intersection>,
  affectedNodeIds: string[]
) {
  let next = intersections;

  for (const nodeId of affectedNodeIds) {
    const degree = index.armsIndex[nodeId]?.length ?? 0;
    const exists = Object.hasOwn(next, nodeId);

    if (degree >= 2 && !exists) {
      next = { ...next, [nodeId]: { nodeId, name: nodeId } };
    } else if (degree < 2 && exists) {
      const { [nodeId]: _, ...rest } = next;
      next = rest;
    }
  }

  return next;
}
