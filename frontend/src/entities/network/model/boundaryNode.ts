import { DEFAULT_SCENARIO, DEFAULT_SINK_CAPACITY } from "./constants";
import type { GraphIndex } from "./graphIndex";
import type { IntersectionArm } from "./intersection";
import type { BoundaryNode } from "./types";

function deriveRoleKind(
  nodeId: string,
  armsIndex: Record<string, IntersectionArm[]>
): "source" | "sink" | null {
  const arms = armsIndex[nodeId];

  if (!arms || arms.length !== 1) {
    return null;
  }

  return arms[0].direction === "outbound" ? "source" : "sink";
}

function defaultRoleFor(kind: "source" | "sink"): BoundaryNode["role"] {
  return kind === "source"
    ? { kind: "source", scenario: { ...DEFAULT_SCENARIO } }
    : { kind: "sink", capacity: DEFAULT_SINK_CAPACITY };
}

export function syncBoundaryNodes(
  index: GraphIndex,
  boundaryNodes: Record<string, BoundaryNode>,
  affectedNodeIds: string[]
): Record<string, BoundaryNode> {
  let next = boundaryNodes;

  for (const nodeId of affectedNodeIds) {
    const degree = index.degreeIndex[nodeId] ?? 0;
    const roleKind = degree === 1 ? deriveRoleKind(nodeId, index.armsIndex) : null;

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
