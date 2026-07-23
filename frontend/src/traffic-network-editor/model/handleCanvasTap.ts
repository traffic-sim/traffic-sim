import type { RoadEdge, RoadNode } from "../../entities/network";

import { EDGE_HIT_RADIUS, ENDPOINT_SNAP_RADIUS, HIT_RADIUS } from "./constants";
import { EditorTool } from "./EditorTool";
import { getEffectiveGridSize } from "./grid";
import { findEdgeAt, findNodeAt } from "./hitTest";
import { resolveSnap } from "./snapping";

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
  nodes: Record<string, RoadNode>;
  edges: Record<string, RoadEdge>;
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
    const gridSize = getEffectiveGridSize(zoom);

    const snap = resolveSnap(worldX, worldY, nodes, ENDPOINT_SNAP_RADIUS / zoom, gridSize);
    const clickedId = snap.nodeId ?? addNode(snap.x, snap.y);

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

    const hitEdge = findEdgeAt(nodes, edges, worldX, worldY, edgeRadius);

    if (hitEdge) {
      selectEdge(hitEdge);
      return;
    }

    clearSelection();
  }
}
