import { create } from "zustand";

interface EditorUiState {
  selectedNodeId: string | null;
  selectNode: (id: string | null) => void;
  reset: () => void;
}

export const useEditorUiStore = create<EditorUiState>((set) => ({
  selectedNodeId: null,
  selectNode: (id) => set({ selectedNodeId: id }),
  reset: () => set({ selectedNodeId: null }),
}));
