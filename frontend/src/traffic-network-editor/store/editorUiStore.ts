import { create } from "zustand";

import { type Camera, DEFAULT_CAMERA } from "../model/camera";
import { EditorTool } from "../model/EditorTool";
import type { SnapResult } from "../model/SnapResult";

interface EditorUiState {
  tool: EditorTool;
  camera: Camera;
  snapPreview: SnapResult | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  setTool: (tool: EditorTool) => void;
  setCamera: (camera: Camera) => void;
  setSnapPreview: (snapPreview: SnapResult | null) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  clearSelection: () => void;
  reset: () => void;
}

export const useEditorUiStore = create<EditorUiState>((set) => ({
  tool: EditorTool.Draw,
  camera: DEFAULT_CAMERA,
  snapPreview: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  setTool: (tool) => set({ tool, snapPreview: null, selectedNodeId: null, selectedEdgeId: null }),
  setCamera: (camera) => set({ camera }),
  setSnapPreview: (snapPreview) => set({ snapPreview }),
  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),
  reset: () =>
    set({
      tool: EditorTool.Draw,
      camera: DEFAULT_CAMERA,
      snapPreview: null,
      selectedNodeId: null,
      selectedEdgeId: null,
    }),
}));
