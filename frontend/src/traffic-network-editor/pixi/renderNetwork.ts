import type { Graphics } from "pixi.js";

import type { Intersection, RoadEdge, RoadNode } from "../../entities/network";
import { type Camera } from "../model/camera";

import { renderEdges } from "./renderEdges";
import { renderNodes } from "./renderNodes";

interface DrawNetworkParams {
  graphics: Graphics;
  nodes: Record<string, RoadNode>;
  edges: Record<string, RoadEdge>;
  intersections: Record<string, Intersection>;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  camera: Camera;
}

export function drawNetwork(params: DrawNetworkParams) {
  const { graphics, nodes, edges, intersections, selectedNodeId, selectedEdgeId, camera } = params;
  graphics.clear();

  renderEdges({ graphics, nodes, edges, selectedEdgeId, camera });

  renderNodes({ graphics, nodes, intersections, selectedNodeId, camera });
}
