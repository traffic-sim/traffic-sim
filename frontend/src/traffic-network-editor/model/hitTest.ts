import type { RoadEdge, RoadNode } from "../../entities/network";

export function findNodeAt(nodes: RoadNode[], x: number, y: number, radius: number): string | null {
  for (const n of nodes) {
    const dx = n.x - x;
    const dy = n.y - y;
    if (dx * dx + dy * dy <= radius * radius) {
      return n.id;
    }
  }
  return null;
}

function distanceToSegment(
  x: number,
  y: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    return Math.hypot(x - ax, y - ay);
  }

  let t = ((x - ax) * dx + (y - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const px = ax + t * dx;
  const py = ay + t * dy;
  return Math.hypot(x - px, y - py);
}

export function findEdgeAt(
  edges: RoadEdge[],
  nodes: RoadNode[],
  x: number,
  y: number,
  radius: number
): string | null {
  for (const e of edges) {
    const from = nodes.find((n) => n.id === e.from);
    const to = nodes.find((n) => n.id === e.to);

    if (!from || !to) {
      continue;
    }

    if (distanceToSegment(x, y, from.x, from.y, to.x, to.y) <= radius) {
      return e.id;
    }
  }
  return null;
}
