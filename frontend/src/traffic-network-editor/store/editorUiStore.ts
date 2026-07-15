import { create } from "zustand";

import { type Camera, DEFAULT_CAMERA } from "../model/camera";
import { EditorTool } from "../model/EditorTool";

interface EditorUiState {
  tool: EditorTool;
  camera: Camera;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  setTool: (tool: EditorTool) => void;
  setCamera: (camera: Camera) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  clearSelection: () => void;
  reset: () => void;
}

export const useEditorUiStore = create<EditorUiState>((set) => ({
  tool: EditorTool.Draw,
  camera: DEFAULT_CAMERA,
  selectedNodeId: null,
  selectedEdgeId: null,
  setTool: (tool) => set({ tool, selectedNodeId: null, selectedEdgeId: null }),
  setCamera: (camera) => set({ camera }),
  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),
  reset: () =>
    set({
      tool: EditorTool.Draw,
      camera: DEFAULT_CAMERA,
      selectedNodeId: null,
      selectedEdgeId: null,
    }),
}));
