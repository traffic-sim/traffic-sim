import type { IntersectionArm } from "./intersection";
import type { RoadEdge } from "./types";

export interface GraphIndex {
  degreeIndex: Record<string, number>;
  armsIndex: Record<string, IntersectionArm[]>;
  inboundCount: Record<string, number>;
  outboundCount: Record<string, number>;
}

export function buildGraphIndex(edges: Record<string, RoadEdge>): GraphIndex {
  const degreeIndex: Record<string, number> = {};
  const armsIndex: Record<string, IntersectionArm[]> = {};
  const inboundCount: Record<string, number> = {};
  const outboundCount: Record<string, number> = {};

  for (const e of Object.values(edges)) {
    degreeIndex[e.from] = (degreeIndex[e.from] ?? 0) + 1;
    degreeIndex[e.to] = (degreeIndex[e.to] ?? 0) + 1;

    outboundCount[e.from] = (outboundCount[e.from] ?? 0) + 1;
    inboundCount[e.to] = (inboundCount[e.to] ?? 0) + 1;

    if (armsIndex[e.from]) {
      armsIndex[e.from].push({ edgeId: e.id, direction: "outbound" });
    } else {
      armsIndex[e.from] = [{ edgeId: e.id, direction: "outbound" }];
    }

    if (armsIndex[e.to]) {
      armsIndex[e.to].push({ edgeId: e.id, direction: "inbound" });
    } else {
      armsIndex[e.to] = [{ edgeId: e.id, direction: "inbound" }];
    }
  }

  return { degreeIndex, armsIndex, inboundCount, outboundCount };
}
