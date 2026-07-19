import type { Graphics } from "pixi.js";

import type { Intersection, RoadEdge, RoadNode } from "../../entities/network";
import type { Vec2 } from "../../entities/Vec2";
import { type Camera, worldToScreen } from "../model/camera";

import {
  ARROW_BACKSTEP_RATIO,
  ARROW_HALF_WIDTH_RATIO,
  ARROW_SIZE,
  COLORS,
  DASH_ALPHA,
  DASH_GAP,
  DASH_LENGTH,
  DASH_STROKE_WIDTH,
  NODE_RADIUS,
  NODE_STROKE_WIDTH,
  ROAD_HIGHLIGHT_ALPHA,
  ROAD_HIGHLIGHT_WIDTH,
  ROAD_LABEL_MIN_ZOOM,
  ROAD_WIDTH,
} from "./constants";
import { drawDashedLine } from "./renderDashedLine";

interface DrawNetworkParams {
  graphics: Graphics;
  nodes: RoadNode[];
  edges: RoadEdge[];
  intersections: Record<string, Intersection>;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  camera: Camera;
}

function drawArrowhead(graphics: Graphics, fromScreen: Vec2, toScreen: Vec2) {
  const dx = toScreen.x - fromScreen.x;
  const dy = toScreen.y - fromScreen.y;

  const len = Math.hypot(dx, dy);

  if (len === 0) {
    return;
  }

  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;

  const mx = (fromScreen.x + toScreen.x) / 2;
  const my = (fromScreen.y + toScreen.y) / 2;

  const tipX = mx + ux * ARROW_SIZE;
  const tipY = my + uy * ARROW_SIZE;

  const baseLX =
    mx - ux * ARROW_SIZE * ARROW_BACKSTEP_RATIO + px * ARROW_SIZE * ARROW_HALF_WIDTH_RATIO;
  const baseLY =
    my - uy * ARROW_SIZE * ARROW_BACKSTEP_RATIO + py * ARROW_SIZE * ARROW_HALF_WIDTH_RATIO;
  const baseRX =
    mx - ux * ARROW_SIZE * ARROW_BACKSTEP_RATIO - px * ARROW_SIZE * ARROW_HALF_WIDTH_RATIO;
  const baseRY =
    my - uy * ARROW_SIZE * ARROW_BACKSTEP_RATIO - py * ARROW_SIZE * ARROW_HALF_WIDTH_RATIO;

  graphics.poly([tipX, tipY, baseLX, baseLY, baseRX, baseRY]).fill(COLORS.road);
}

export function drawNetwork(params: DrawNetworkParams) {
  const { graphics, nodes, edges, intersections, selectedNodeId, selectedEdgeId, camera } = params;
  graphics.clear();

  for (const edge of edges) {
    const from = nodes.find((n) => n.id === edge.from);
    const to = nodes.find((n) => n.id === edge.to);

    if (!from || !to) {
      continue;
    }

    const fromScreen = worldToScreen(from.position.x, from.position.y, camera);
    const toScreen = worldToScreen(to.position.x, to.position.y, camera);
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

    if (camera.zoom > ROAD_LABEL_MIN_ZOOM) {
      drawArrowhead(graphics, fromScreen, toScreen);
    }
  }

  for (const node of nodes) {
    const isSelected = node.id === selectedNodeId;
    const isIntersection = node.id in intersections;
    const point = worldToScreen(node.position.x, node.position.y, camera);

    graphics
      .circle(point.x, point.y, NODE_RADIUS)
      .fill(
        isSelected
          ? COLORS.nodeSelected
          : isIntersection
            ? COLORS.intersectionNode
            : COLORS.nodeDefault
      )
      .stroke({ width: NODE_STROKE_WIDTH, color: COLORS.nodeStroke });
  }
}
