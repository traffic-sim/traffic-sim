import { create } from "zustand";

import type { NetworkGraph, RoadEdge, RoadNode } from "./types";

interface NetworkState {
  nodes: RoadNode[];
  edges: RoadEdge[];
  addNode: (x: number, y: number) => string;
  addEdge: (from: string, to: string) => void;
  setGraph: (graph: NetworkGraph) => void;
  reset: () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => {
  return {
    nodes: [],
    edges: [],

    addNode: (x, y) => {
      const id = `n-${crypto.randomUUID()}`;
      set((state) => ({ nodes: [...state.nodes, { id, x, y }] }));
      return id;
    },

    addEdge: (from, to) => {
      if (from === to) {
        return;
      }

      const exists = get().edges.some(
        (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
      );

      if (exists) {
        return;
      }

      const id = `e-${crypto.randomUUID()}`;
      set((state) => ({
        edges: [...state.edges, { id, from, to }],
      }));
    },

    setGraph: (graph) =>
      set({
        nodes: graph.nodes,
        edges: graph.edges,
      }),

    reset: () => {
      set({ nodes: [], edges: [] });
    },
  };
});
