import type { Vec2 } from "../../Vec2";

export interface RoadNode {
  id: string;
  position: Vec2;
}

export interface SpeedZone {
  fromT: number; // 0-1, fraction along the road's length
  toT: number; // 0-1
  limit: number; // km/h - reduced speed limit within this zone
}

export interface RoadEdge {
  id: string;
  name: string; // user-facing, editable label - defaults to "R001" style
  from: string;
  to: string;
  vFree: number; // km/h - free-flow speed
  rhoCritical: number; // veh/km - density at capacity
  rhoJam: number; // veh/km - jam density
  cells: number; // discretization count for the simulation
  speedZones: SpeedZone[];
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
  capacity: number; // veh
  unlimited: boolean; // when true, capacity is ignored - every car is accepted
}

export type BoundaryRole = SourceRole | SinkRole;

export interface BoundaryNode {
  nodeId: string;
  name: string;
  role: BoundaryRole;
}

export interface NetworkGraph {
  nodes: Record<string, RoadNode>;
  edges: Record<string, RoadEdge>;
}
