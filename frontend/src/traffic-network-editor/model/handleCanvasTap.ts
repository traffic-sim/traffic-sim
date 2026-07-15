import type { RoadEdge, RoadNode } from "../../entities/network";

import { EDGE_HIT_RADIUS, HIT_RADIUS } from "./constants";
import { EditorTool } from "./EditorTool";
import { findEdgeAt, findNodeAt } from "./hitTest";

export interface CanvasTapActions {
  addNode: (x: number, y: number) => string;
  addEdge: (from: string, to: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  clearSelection: () => void;
}

export interface CanvasTapState {
  tool: EditorTool;
  zoom: number;
  selectedNodeId: string | null;
  nodes: RoadNode[];
  edges: RoadEdge[];
}

export function handleCanvasTap(
  worldX: number,
  worldY: number,
  state: CanvasTapState,
  actions: CanvasTapActions
) {
  const { tool, zoom, selectedNodeId, nodes, edges } = state;
  const { addNode, addEdge, selectNode, selectEdge, clearSelection } = actions;

  const nodeRadius = HIT_RADIUS / zoom;
  const edgeRadius = EDGE_HIT_RADIUS / zoom;

  if (tool === EditorTool.Draw) {
    const existingId = findNodeAt(nodes, worldX, worldY, nodeRadius);
    const clickedId = existingId ?? addNode(worldX, worldY);

    if (!selectedNodeId) {
      selectNode(clickedId);
    } else if (selectedNodeId === clickedId) {
      selectNode(null);
    } else {
      addEdge(selectedNodeId, clickedId);
      selectNode(null);
    }
    return;
  }

  if (tool === EditorTool.Select) {
    const hitNode = findNodeAt(nodes, worldX, worldY, nodeRadius);

    if (hitNode) {
      selectNode(hitNode);
      return;
    }

    const hitEdge = findEdgeAt(edges, nodes, worldX, worldY, edgeRadius);

    if (hitEdge) {
      selectEdge(hitEdge);
      return;
    }

    clearSelection();
  }
}
