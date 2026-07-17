import type { Vec2 } from "../../Vec2";

export interface RoadNode {
  id: string;
  position: Vec2;
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
