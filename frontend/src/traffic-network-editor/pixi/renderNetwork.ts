import type { Graphics } from "pixi.js";

import type { RoadEdge, RoadNode } from "../../entities/network";
import { type Camera, worldToScreen } from "../model/camera";

import {
  COLORS,
  DASH_ALPHA,
  DASH_GAP,
  DASH_LENGTH,
  DASH_STROKE_WIDTH,
  NODE_RADIUS,
  NODE_STROKE_WIDTH,
  ROAD_HIGHLIGHT_ALPHA,
  ROAD_HIGHLIGHT_WIDTH,
  ROAD_WIDTH,
} from "./constants";
import { drawDashedLine } from "./renderDashedLine";

interface DrawNetworkParams {
  graphics: Graphics;
  nodes: RoadNode[];
  edges: RoadEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  camera: Camera;
}

export function drawNetwork(params: DrawNetworkParams) {
  const { graphics, nodes, edges, selectedNodeId, selectedEdgeId, camera } = params;
  graphics.clear();

  for (const edge of edges) {
    const from = nodes.find((n) => n.id === edge.from);
    const to = nodes.find((n) => n.id === edge.to);

    if (!from || !to) {
      continue;
    }

    const fromScreen = worldToScreen(from.x, from.y, camera);
    const toScreen = worldToScreen(to.x, to.y, camera);
    const isSelected = edge.id === selectedEdgeId;

    if (isSelected) {
      graphics.moveTo(fromScreen.x, fromScreen.y).lineTo(toScreen.x, toScreen.y).stroke({
        width: ROAD_HIGHLIGHT_WIDTH,
        color: COLORS.nodeSelected,
        cap: "round",
        alpha: ROAD_HIGHLIGHT_ALPHA,
      });
    }

    graphics
      .moveTo(fromScreen.x, fromScreen.y)
      .lineTo(toScreen.x, toScreen.y)
      .stroke({ width: ROAD_WIDTH, color: COLORS.road, cap: "round" });

    graphics
      .moveTo(fromScreen.x, fromScreen.y)
      .lineTo(toScreen.x, toScreen.y)
      .stroke({
        width: ROAD_WIDTH - 4,
        color: isSelected ? COLORS.roadFillSelected : COLORS.roadFill,
        cap: "round",
      });

    drawDashedLine(
      graphics,
      fromScreen.x,
      fromScreen.y,
      toScreen.x,
      toScreen.y,
      DASH_LENGTH * camera.zoom,
      DASH_GAP * camera.zoom,
      COLORS.dash,
      DASH_ALPHA,
      DASH_STROKE_WIDTH
    );
  }

  for (const node of nodes) {
    const isSelected = node.id === selectedNodeId;
    const point = worldToScreen(node.x, node.y, camera);
    graphics
      .circle(point.x, point.y, NODE_RADIUS)
      .fill(isSelected ? COLORS.nodeSelected : COLORS.nodeDefault)
      .stroke({ width: NODE_STROKE_WIDTH, color: COLORS.nodeStroke });
  }
}
