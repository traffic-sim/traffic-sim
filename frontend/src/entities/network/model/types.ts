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

export interface Intersection {
  nodeId: string;
  name: string;
}

export type ScenarioType = "constant" | "sinusoidal" | "nyc_peak" | "random_pulse" | "ramp_up";

export interface TrafficScenario {
  type: ScenarioType;
  baseInflow: number;
  amplitude: number;
  period: number;
}

export interface SourceRole {
  kind: "source";
  scenario: TrafficScenario;
}

export interface SinkRole {
  kind: "sink";
  capacity: number;
}

export type BoundaryRole = SourceRole | SinkRole;

export interface BoundaryNode {
  nodeId: string;
  name: string;
  role: BoundaryRole;
}

export interface NetworkGraph {
  nodes: RoadNode[];
  edges: RoadEdge[];
}
