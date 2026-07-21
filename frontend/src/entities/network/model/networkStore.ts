import { create } from "zustand";

import { syncBoundaryNodes } from "./boundaryNode";
import { syncIntersections } from "./intersection";
import type { BoundaryNode, Intersection, NetworkGraph, RoadEdge, RoadNode } from "./types";

interface NetworkState {
  nodes: RoadNode[];
  edges: RoadEdge[];
  intersections: Record<string, Intersection>;
  boundaryNodes: Record<string, BoundaryNode>;
  addNode: (x: number, y: number) => string;
  addEdge: (from: string, to: string) => void;
  flipEdgeDirection: (id: string) => void;
  updateBoundaryNode: (
    nodeId: string,
    patch: Partial<Omit<BoundaryNode, "nodeId" | "role">>
  ) => void;
  updateBoundaryRole: (nodeId: string, patch: Partial<BoundaryNode["role"]>) => void;
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
    boundaryNodes: {},

    addNode: (x, y) => {
      const id = `n-${crypto.randomUUID()}`;

      set((state) => {
        const nodes = [...state.nodes, { id, position: { x, y } }];

        return {
          nodes,
          boundaryNodes: syncBoundaryNodes(state.edges, state.boundaryNodes, [id]),
        };
      });

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
          boundaryNodes: syncBoundaryNodes(edges, state.boundaryNodes, [from, to]),
        };
      });
    },

    flipEdgeDirection: (id) => {
      set((state) => ({
        edges: state.edges.map((e) => (e.id === id ? { ...e, from: e.to, to: e.to } : e)),
      }));

      const edge = get().edges.find((e) => e.id === id);

      if (edge) {
        set((state) => ({
          boundaryNodes: syncBoundaryNodes(state.edges, state.boundaryNodes, [edge.from, edge.to]),
        }));
      }
    },

    updateBoundaryNode: (nodeId, patch) => {
      set((state) => {
        const existing = state.boundaryNodes[nodeId];

        if (!existing) {
          return state;
        }

        return {
          boundaryNodes: { ...state.boundaryNodes, [nodeId]: { ...existing, ...patch } },
        };
      });
    },

    updateBoundaryRole: (nodeId, patch) => {
      set((state) => {
        const existing = state.boundaryNodes[nodeId];

        if (!existing) {
          return state;
        }

        return {
          boundaryNodes: {
            ...state.boundaryNodes,
            [nodeId]: { ...existing, role: { ...existing.role, ...patch } as BoundaryNode["role"] },
          },
        };
      });
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
        const { [id]: _removedIx, ...intersectionsWithoutSelf } = state.intersections;
        const { [id]: _removedBn, ...boundaryNodesWithoutSelf } = state.boundaryNodes;

        return {
          nodes: state.nodes.filter((n) => n.id !== id),
          edges,
          intersections: syncIntersections(edges, intersectionsWithoutSelf, [...affected]),
          boundaryNodes: syncBoundaryNodes(edges, boundaryNodesWithoutSelf, [...affected]),
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
          boundaryNodes: syncBoundaryNodes(edges, state.boundaryNodes, affected),
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
        boundaryNodes: syncBoundaryNodes(
          graph.edges,
          {},
          graph.nodes.map((n) => n.id)
        ),
      }),

    reset: () => {
      set({ nodes: [], edges: [], intersections: {}, boundaryNodes: {} });
    },
  };
});
