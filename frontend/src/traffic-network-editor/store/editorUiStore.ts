import { create } from "zustand";

import { type Camera, DEFAULT_CAMERA } from "../model/camera";
import { EditorTool } from "../model/EditorTool";
import type { SnapResult } from "../model/SnapResult";

interface EditorUiState {
  tool: EditorTool;
  camera: Camera;
  snapPreview: SnapResult | null;
  drawStartNodeId: string | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  expandedSpeedZoneIndex: number | null;
  setTool: (tool: EditorTool) => void;
  setCamera: (camera: Camera) => void;
  setSnapPreview: (snapPreview: SnapResult | null) => void;
  setDrawStartNodeId: (id: string | null) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  clearSelection: () => void;
  setExpandedSpeedZoneIndex: (index: number | null) => void;
  reset: () => void;
}

export const useEditorUiStore = create<EditorUiState>((set) => ({
  tool: EditorTool.Draw,
  camera: DEFAULT_CAMERA,
  snapPreview: null,
  drawStartNodeId: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  expandedSpeedZoneIndex: null,
  setTool: (tool) =>
    set({
      tool,
      snapPreview: null,
      drawStartNodeId: null,
      selectedNodeId: null,
      selectedEdgeId: null,
      expandedSpeedZoneIndex: null,
    }),
  setCamera: (camera) => set({ camera }),
  setSnapPreview: (snapPreview) => set({ snapPreview }),
  setDrawStartNodeId: (id) => set({ drawStartNodeId: id }),
  selectNode: (id) =>
    set({ selectedNodeId: id, selectedEdgeId: null, expandedSpeedZoneIndex: null }),
  selectEdge: (id) =>
    set({ selectedEdgeId: id, selectedNodeId: null, expandedSpeedZoneIndex: null }),
  clearSelection: () =>
    set({ selectedNodeId: null, selectedEdgeId: null, expandedSpeedZoneIndex: null }),
  setExpandedSpeedZoneIndex: (expandedSpeedZoneIndex) => set({ expandedSpeedZoneIndex }),
  reset: () =>
    set({
      tool: EditorTool.Draw,
      camera: DEFAULT_CAMERA,
      snapPreview: null,
      drawStartNodeId: null,
      selectedNodeId: null,
      selectedEdgeId: null,
      expandedSpeedZoneIndex: null,
    }),
}));
