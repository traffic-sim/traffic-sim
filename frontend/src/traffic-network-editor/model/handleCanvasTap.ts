import type { RoadEdge, RoadNode } from "../../entities/network";

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
  const { tool, selectedNodeId, nodes, edges } = state;
  const { addNode, addEdge, selectNode, selectEdge, clearSelection } = actions;

  if (tool === EditorTool.Draw) {
    const existingId = findNodeAt(nodes, worldX, worldY);
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
    const hitNode = findNodeAt(nodes, worldX, worldY);

    if (hitNode) {
      selectNode(hitNode);
      return;
    }

    const hitEdge = findEdgeAt(edges, nodes, worldX, worldY);

    if (hitEdge) {
      selectEdge(hitEdge);
      return;
    }

    clearSelection();
  }
}
