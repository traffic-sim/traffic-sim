import { DEFAULT_SCENARIO, DEFAULT_SINK_CAPACITY } from "./constants";
import type { BoundaryNode, RoadEdge } from "./types";

function getDegree(nodeId: string, edges: RoadEdge[]): number {
  let degree = 0;

  for (const e of edges) {
    if (e.from === nodeId || e.to === nodeId) {
      degree++;
    }
  }

  return degree;
}

function getBoundaryEdge(
  nodeId: string,
  edges: RoadEdge[]
): { edge: RoadEdge; end: "from" | "to" } | null {
  for (const e of edges) {
    if (e.from === nodeId) {
      return { edge: e, end: "from" };
    }
    if (e.to === nodeId) {
      return { edge: e, end: "to" };
    }
  }

  return null;
}

function deriveRoleKind(nodeId: string, edges: RoadEdge[]): "source" | "sink" | null {
  const boundary = getBoundaryEdge(nodeId, edges);

  if (!boundary) {
    return null;
  }

  return boundary.end === "from" ? "source" : "sink";
}

function defaultRoleFor(kind: "source" | "sink"): BoundaryNode["role"] {
  return kind === "source"
    ? { kind: "source", scenario: { ...DEFAULT_SCENARIO } }
    : { kind: "sink", capacity: DEFAULT_SINK_CAPACITY };
}

export function syncBoundaryNodes(
  edges: RoadEdge[],
  boundaryNodes: Record<string, BoundaryNode>,
  affectedNodeIds: string[]
): Record<string, BoundaryNode> {
  let next = boundaryNodes;

  for (const nodeId of affectedNodeIds) {
    const degree = getDegree(nodeId, edges);
    const roleKind = degree === 1 ? deriveRoleKind(nodeId, edges) : null;
    const existing = next[nodeId];

    if (roleKind === null) {
      if (existing) {
        const { [nodeId]: _removed, ...rest } = next;
        next = rest;
      }

      continue;
    }

    if (!existing) {
      next = { ...next, [nodeId]: { nodeId, name: nodeId, role: defaultRoleFor(roleKind) } };
    } else if (existing.role.kind !== roleKind) {
      next = { ...next, [nodeId]: { ...existing, role: defaultRoleFor(roleKind) } };
    }
  }

  return next;
}
