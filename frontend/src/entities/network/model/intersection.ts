import type { Intersection, RoadEdge } from "./types";

export type ArmDirection = "inbound" | "outbound";

export interface IntersectionArm {
  edgeId: string;
  direction: ArmDirection;
}

export function getArms(nodeId: string, edges: RoadEdge[]) {
  const arms: IntersectionArm[] = [];

  for (const e of edges) {
    if (e.from === nodeId) {
      arms.push({ edgeId: e.id, direction: "outbound" });
    } else if (e.to === nodeId) {
      arms.push({ edgeId: e.id, direction: "inbound" });
    }
  }

  return arms;
}

export function buildArmsIndex(edges: RoadEdge[]) {
  const index = new Map<string, IntersectionArm[]>();

  const push = (nodeId: string, arm: IntersectionArm) => {
    const list = index.get(nodeId);

    if (list) {
      list.push(arm);
    } else {
      index.set(nodeId, [arm]);
    }
  };

  for (const e of edges) {
    push(e.from, { edgeId: e.id, direction: "outbound" });
    push(e.to, { edgeId: e.id, direction: "inbound" });
  }

  return index;
}

export type IntersectionKind = "chain" | "junction" | "merge" | "diverge";

export function getIntersectionKind(arms: IntersectionArm[]) {
  const inbound = arms.filter((a) => a.direction === "inbound").length;
  const outbound = arms.length - inbound;

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
  edges: RoadEdge[],
  intersections: Record<string, Intersection>,
  affectedNodeIds: string[]
) {
  let next = intersections;

  for (const nodeId of affectedNodeIds) {
    const degree = getArms(nodeId, edges).length;
    const exists = nodeId in next;

    if (degree >= 2 && !exists) {
      next = { ...next, [nodeId]: { nodeId, name: nodeId } };
    } else if (degree < 2 && exists) {
      const { [nodeId]: _, ...rest } = next;
      next = rest;
    }
  }

  return next;
}
