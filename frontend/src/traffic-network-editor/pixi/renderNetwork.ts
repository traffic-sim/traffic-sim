import type { Graphics } from "pixi.js";

import type { RoadEdge, RoadNode } from "../../entities/network";
import { type Camera, worldToScreen } from "../model/camera";

import { COLORS, NODE_RADIUS, ROAD_WIDTH } from "./constants";

interface DrawNetworkParams {
  graphics: Graphics;
  nodes: RoadNode[];
  edges: RoadEdge[];
  selectedNodeId: string | null;
  camera: Camera;
}

export function drawNetwork({ graphics, nodes, edges, selectedNodeId, camera }: DrawNetworkParams) {
  graphics.clear();

  for (const edge of edges) {
    const from = nodes.find((n) => n.id === edge.from);
    const to = nodes.find((n) => n.id === edge.to);
    if (!from || !to) {
      continue;
    }

    const fromScreen = worldToScreen(from.x, from.y, camera);
    const toScreen = worldToScreen(to.x, to.y, camera);

    graphics
      .moveTo(fromScreen.x, fromScreen.y)
      .lineTo(toScreen.x, toScreen.y)
      .stroke({ width: ROAD_WIDTH, color: COLORS.road, cap: "round" });

    graphics
      .moveTo(fromScreen.x, fromScreen.y)
      .lineTo(toScreen.x, toScreen.y)
      .stroke({ width: ROAD_WIDTH - 4, color: COLORS.roadFill, cap: "round" });
  }

  for (const node of nodes) {
    const isSelected = node.id === selectedNodeId;
    const point = worldToScreen(node.x, node.y, camera);
    graphics
      .circle(point.x, point.y, NODE_RADIUS)
      .fill(isSelected ? COLORS.nodeSelected : COLORS.nodeDefault)
      .stroke({ width: 2, color: COLORS.nodeStroke });
  }
}
