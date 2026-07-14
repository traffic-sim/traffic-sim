import { create } from "zustand";

import { EditorTool } from "../model/EditorTool";

interface EditorUiState {
  tool: EditorTool;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  setTool: (tool: EditorTool) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  clearSelection: () => void;
  reset: () => void;
}

export const useEditorUiStore = create<EditorUiState>((set) => ({
  tool: EditorTool.Draw,
  selectedNodeId: null,
  selectedEdgeId: null,
  setTool: (tool) => set({ tool, selectedNodeId: null, selectedEdgeId: null }),
  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),
  reset: () => set({ tool: EditorTool.Draw, selectedNodeId: null, selectedEdgeId: null }),
}));
