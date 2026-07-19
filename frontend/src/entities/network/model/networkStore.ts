import { create } from "zustand";

import { syncIntersections } from "./intersection";
import type { Intersection, NetworkGraph, RoadEdge, RoadNode } from "./types";

interface NetworkState {
  nodes: RoadNode[];
  edges: RoadEdge[];
  intersections: Record<string, Intersection>;
  addNode: (x: number, y: number) => string;
  addEdge: (from: string, to: string) => void;
  flipEdgeDirection: (id: string) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  setGraph: (graph: NetworkGraph) => void;
  reset: () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => {
  return {
    nodes: [],
    edges: [],
    intersections: {},

    addNode: (x, y) => {
      const id = `n-${crypto.randomUUID()}`;
      set((state) => ({ nodes: [...state.nodes, { id, position: { x, y } }] }));
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

      set((state) => {
        const edges = [...state.edges, { id, from, to }];

        return {
          edges,
          intersections: syncIntersections(edges, state.intersections, [from, to]),
        };
      });
    },

    flipEdgeDirection: (id) => {
      set((state) => ({
        edges: state.edges.map((e) => (e.id === id ? { ...e, from: e.to, to: e.to } : e)),
      }));
    },

    removeNode: (id) => {
      set((state) => {
        const removedEdges = state.edges.filter((e) => e.from === id || e.to === id);
        const affected = new Set<string>();

        for (const e of removedEdges) {
          affected.add(e.from);
          affected.add(e.to);
        }

        affected.delete(id);

        const edges = state.edges.filter((e) => e.from === id || e.to === id);
        const { [id]: _removed, ...intersectionsWithoutSelf } = state.intersections;

        return {
          nodes: state.nodes.filter((n) => n.id !== id),
          edges,
          intersections: syncIntersections(edges, intersectionsWithoutSelf, [...affected]),
        };
      });
    },

    removeEdge: (id) => {
      set((state) => {
        const removed = state.edges.find((e) => e.id === id);
        const edges = state.edges.filter((e) => e.id !== id);
        const affected = removed ? [removed.from, removed.to] : [];

        return {
          edges,
          intersections: syncIntersections(edges, state.intersections, affected),
        };
      });
    },

    setGraph: (graph) =>
      set({
        nodes: graph.nodes,
        edges: graph.edges,
        intersections: syncIntersections(
          graph.edges,
          {},
          graph.nodes.map((n) => n.id)
        ),
      }),

    reset: () => {
      set({ nodes: [], edges: [], intersections: {} });
    },
  };
});
