import type { Graphics } from "pixi.js";
import type { RoadEdge, RoadNode } from "../types.ts";
import { COLORS, NODE_RADIUS, ROAD_WIDTH } from "./constants.ts";

interface DrawNetworkParams {
  graphics: Graphics;
  nodes: RoadNode[];
  edges: RoadEdge[];
  selectedNodeId: string | null;
}

export function drawNetwork({ graphics, nodes, edges, selectedNodeId }: DrawNetworkParams) {
  graphics.clear();

  for (const edge of edges) {
    const from = nodes.find((n) => n.id === edge.from);
    const to = nodes.find((n) => n.id === edge.to);
    if (!from || !to) continue;

    graphics
      .moveTo(from.x, from.y)
      .lineTo(to.x, to.y)
      .stroke({ width: ROAD_WIDTH, color: COLORS.road, cap: "round" });

    graphics
      .moveTo(from.x, from.y)
      .lineTo(to.x, to.y)
      .stroke({ width: ROAD_WIDTH - 4, color: COLORS.roadFill, cap: "round" });
  }

  for (const node of nodes) {
    const isSelected = node.id === selectedNodeId;
    graphics
      .circle(node.x, node.y, NODE_RADIUS)
      .fill(isSelected ? COLORS.nodeSelected : COLORS.nodeDefault)
      .stroke({ width: 2, color: COLORS.nodeStroke });
  }
}
