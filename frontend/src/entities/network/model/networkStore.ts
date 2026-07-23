import { create } from "zustand";

import { syncBoundaryNodes } from "./boundaryNode";
import { buildGraphIndex, type GraphIndex } from "./graphIndex";
import { syncIntersections } from "./intersection";
import type { BoundaryNode, Intersection, NetworkGraph, RoadEdge, RoadNode } from "./types";

interface NetworkState {
  nodes: Record<string, RoadNode>;
  edges: Record<string, RoadEdge>;
  intersections: Record<string, Intersection>;
  boundaryNodes: Record<string, BoundaryNode>;
  graphIndex: GraphIndex;
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
    nodes: {},
    edges: {},
    intersections: {},
    boundaryNodes: {},
    graphIndex: buildGraphIndex({}),

    addNode: (x, y) => {
      const id = `n-${crypto.randomUUID()}`;

      set((state) => {
        const nodes = { ...state.nodes, [id]: { id, position: { x, y } } };

        return {
          nodes,
          boundaryNodes: syncBoundaryNodes(state.graphIndex, state.boundaryNodes, [id]),
        };
      });

      return id;
    },

    addEdge: (from, to) => {
      if (from === to) {
        return;
      }

      const exists = Object.values(get().edges).some(
        (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from)
      );

      if (exists) {
        return;
      }

      const id = `e-${crypto.randomUUID()}`;

      set((state) => {
        const edges = { ...state.edges, [id]: { id, from, to } };
        const graphIndex = buildGraphIndex(edges);

        return {
          edges,
          intersections: syncIntersections(graphIndex, state.intersections, [from, to]),
          boundaryNodes: syncBoundaryNodes(graphIndex, state.boundaryNodes, [from, to]),
          graphIndex,
        };
      });
    },

    flipEdgeDirection: (id) => {
      const edge = get().edges[id];

      if (!edge) {
        return;
      }

      set((state) => {
        const edges = {
          ...state.edges,
          [id]: { ...edge, from: edge.to, to: edge.from },
        };

        const graphIndex = buildGraphIndex(edges);

        return {
          edges,

          boundaryNodes: syncBoundaryNodes(graphIndex, state.boundaryNodes, [edge.from, edge.to]),
          graphIndex,
        };
      });
    },

    updateBoundaryNode: (nodeId, patch) => {
      const existing = get().boundaryNodes[nodeId];

      if (!existing) {
        return;
      }

      set((state) => {
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
        const affected = new Set<string>();

        for (const e of Object.values(state.edges)) {
          if (e.from === id || e.to === id) {
            affected.add(e.from);
            affected.add(e.to);
          }
        }

        affected.delete(id);

        const { [id]: _, ...nodes } = state.nodes;
        const edges = Object.fromEntries(
          Object.entries(state.edges).filter(([_, e]) => e.from !== id && e.to !== id)
        );

        const { [id]: __, ...intersections } = state.intersections;
        const { [id]: ___, ...boundaryNodes } = state.boundaryNodes;

        const graphIndex = buildGraphIndex(edges);

        return {
          nodes,
          edges,
          intersections: syncIntersections(graphIndex, intersections, [...affected]),
          boundaryNodes: syncBoundaryNodes(graphIndex, boundaryNodes, [...affected]),
          graphIndex,
        };
      });
    },

    removeEdge: (id) => {
      set((state) => {
        const removed = state.edges[id];
        const { [id]: _, ...edges } = state.edges;
        const affected = removed ? [removed.from, removed.to] : [];
        const graphIndex = buildGraphIndex(edges);
        return {
          edges,
          intersections: syncIntersections(graphIndex, state.intersections, affected),
          boundaryNodes: syncBoundaryNodes(graphIndex, state.boundaryNodes, affected),
          graphIndex,
        };
      });
    },

    setGraph: (graph) => {
      set((_) => {
        const graphIndex = buildGraphIndex(graph.edges);

        return {
          nodes: graph.nodes,
          edges: graph.edges,
          intersections: syncIntersections(graphIndex, {}, Object.keys(graph.nodes)),
          boundaryNodes: syncBoundaryNodes(graphIndex, {}, Object.keys(graph.nodes)),
          graphIndex,
        };
      });
    },

    reset: () => {
      set({
        nodes: {},
        edges: {},
        intersections: {},
        boundaryNodes: {},
        graphIndex: buildGraphIndex({}),
      });
    },
  };
});
