import type { RoadEdge, RoadNode } from "../../entities/network";

export function findNodeAt(
  nodes: Record<string, RoadNode>,
  worldX: number,
  worldY: number,
  radius: number
): string | null {
  for (const [id, n] of Object.entries(nodes)) {
    const dx = n.position.x - worldX;
    const dy = n.position.y - worldY;

    if (dx * dx + dy * dy <= radius * radius) {
      return id;
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
  nodes: Record<string, RoadNode>,
  edges: Record<string, RoadEdge>,
  worldX: number,
  worldY: number,
  radius: number
): string | null {
  for (const e of Object.values(edges)) {
    const from = nodes[e.from];
    const to = nodes[e.to];

    if (!from || !to) {
      continue;
    }

    if (
      distanceToSegment(
        worldX,
        worldY,
        from.position.x,
        from.position.y,
        to.position.x,
        to.position.y
      ) <= radius
    ) {
      return e.id;
    }
  }

  return null;
}
