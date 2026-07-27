import type { RoadEdge } from "./types";

const ROAD_NAME_PATTERN = /^R(\d+)$/;

/* Finds the next unused "R00N"-style name, based on the highest existing
 *  matching number - not the edge count, so deleting roads never causes a
 *  name collision with one that still exists. */
export function generateNextRoadName(edges: Record<string, RoadEdge>): string {
  let highest = 0;

  for (const edge of Object.values(edges)) {
    const match = ROAD_NAME_PATTERN.exec(edge.name);

    if (match) {
      highest = Math.max(highest, Number(match[1]));
    }
  }

  return `R${String(highest + 1).padStart(3, "0")}`;
}
