import type { Graphics } from "pixi.js";

import type { Intersection, RoadNode } from "../../entities/network";
import { type Camera, worldToScreen } from "../model/camera";

import { COLORS, NODE_RADIUS, NODE_STROKE_WIDTH } from "./constants";

interface RenderNodesParams {
  graphics: Graphics;
  nodes: Record<string, RoadNode>;
  intersections: Record<string, Intersection>;
  selectedNodeId: string | null;
  camera: Camera;
}

export function renderNodes(params: RenderNodesParams) {
  const { graphics, nodes, intersections, selectedNodeId, camera } = params;

  for (const node of Object.values(nodes)) {
    const isSelected = node.id === selectedNodeId;
    const isIntersection = Object.hasOwn(intersections, node.id);
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
