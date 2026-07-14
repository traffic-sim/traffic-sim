export interface RoadNode {
  id: string;
  x: number;
  y: number;
}

export interface RoadEdge {
  id: string;
  from: string;
  to: string;
}

export interface NetworkGraph {
  nodes: RoadNode[];
  edges: RoadEdge[];
}
