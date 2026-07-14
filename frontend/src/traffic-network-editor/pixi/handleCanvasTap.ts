import { findNodeAt } from "../model/hitTest";

import type { RoadNode } from "../../entities/network";

export interface CanvasTapActions {
  addNode: (x: number, y: number) => string;
  addEdge: (from: string, to: string) => void;
  selectNode: (id: string | null) => void;
}

export interface CanvasTapState {
  selectedNodeId: string | null;
  nodes: RoadNode[];
}

export function handleCanvasTap(
  x: number,
  y: number,
  state: CanvasTapState,
  actions: CanvasTapActions
) {
  const { selectedNodeId, nodes } = state;
  const { addNode, addEdge, selectNode } = actions;

  const existingId = findNodeAt(nodes, x, y);
  const clickedId = existingId ?? addNode(x, y);

  if (!selectedNodeId) {
    selectNode(clickedId);
  } else if (selectedNodeId === clickedId) {
    selectNode(null);
  } else {
    addEdge(selectedNodeId, clickedId);
    selectNode(null);
  }
}
