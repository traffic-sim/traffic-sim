import { create } from "zustand";
import type { RoadEdge, RoadNode } from "../types.ts";
import { findNodeAt } from "../pixi/hitTest.ts";

interface NetworkState {
  nodes: RoadNode[];
  edges: RoadEdge[];
  selectedNodeId: string | null;
  addNode: (x: number, y: number) => string;
  selectNode: (id: string | null) => void;
  addEdge: (from: string, to: string) => void;
  handleCanvasTap: (x: number, y: number) => void;
  reset: () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => {
  let nodeCounter = 0;
  let edgeCounter = 0;

  return {
    nodes: [],
    edges: [],
    selectedNodeId: null,

    addNode: (x, y) => {
      const id = `n${nodeCounter++}`;
      set((state) => ({ nodes: [...state.nodes, { id, x, y }] }));
      return id;
    },

    selectNode: (id) => set({ selectedNodeId: id }),

    addEdge: (from, to) => {
      if (from === to) return;
      const exists = get().edges.some(
        (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
      );
      if (exists) return;
      const id = `e${edgeCounter++}`;
      set((state) => ({ edges: [...state.edges, { id, from, to }] }));
    },

    handleCanvasTap: (x, y) => {
      const { nodes, selectedNodeId, addNode, addEdge, selectNode } = get();
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
    },

    reset: () => {
      nodeCounter = 0;
      edgeCounter = 0;
      set({ nodes: [], edges: [], selectedNodeId: null });
    },
  };
});
