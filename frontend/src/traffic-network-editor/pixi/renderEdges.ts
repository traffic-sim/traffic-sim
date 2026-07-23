import type { Graphics } from "pixi.js";

import type { RoadEdge, RoadNode } from "../../entities/network";
import { type Camera, worldToScreen } from "../model/camera";

import {
  COLORS,
  DASH_ALPHA,
  DASH_GAP,
  DASH_LENGTH,
  DASH_STROKE_WIDTH,
  LABEL_MIN_ZOOM,
  ROAD_HIGHLIGHT_ALPHA,
  ROAD_HIGHLIGHT_WIDTH,
  ROAD_WIDTH,
} from "./constants";
import { drawArrowhead } from "./renderArrowhead";
import { renderDashedLine } from "./renderDashedLine";

interface RenderEdgesParams {
  graphics: Graphics;
  nodes: Record<string, RoadNode>;
  edges: Record<string, RoadEdge>;
  selectedEdgeId: string | null;
  camera: Camera;
}

export function renderEdges(params: RenderEdgesParams) {
  const { graphics, nodes, edges, selectedEdgeId, camera } = params;

  for (const edge of Object.values(edges)) {
    const from = nodes[edge.from];
    const to = nodes[edge.to];

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

    renderDashedLine(
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

    if (camera.zoom > LABEL_MIN_ZOOM) {
      drawArrowhead(graphics, fromScreen, toScreen);
    }
  }
}
