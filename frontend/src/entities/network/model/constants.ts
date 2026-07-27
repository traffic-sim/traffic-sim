import type { RoadEdge, TrafficScenario } from "./types";

// Everything road-related is stored directly in km/h (speed) and veh/km
// (density) - there is no SI layer or unit conversion in the frontend at
// all. Any conversion the simulation backend needs happens in Rust, at the
// boundary, not here.
export const DEFAULT_EDGE_PROPERTIES: Omit<RoadEdge, "id" | "name" | "from" | "to"> = {
  vFree: 100, // km/h
  rhoCritical: 30, // veh/km
  rhoJam: 150, // veh/km
  cells: 100,
  speedZones: [],
};

export const DEFAULT_SCENARIO: TrafficScenario = {
  type: "constant",
  baseInflow: 0.3,
  amplitude: 0.5,
  period: 300,
};

export const DEFAULT_SINK_CAPACITY = 50;

export const V_FREE_RANGE = { min: 5, max: 150, step: 1 } as const; // km/h
export const RHO_CRITICAL_RANGE = { min: 5, max: 80, step: 1 } as const; // veh/km
export const RHO_JAM_RANGE = { min: 50, max: 300, step: 5 } as const; // veh/km
export const CELL_COUNT_RANGE = { min: 10, max: 500, step: 5 } as const;

export const SPEED_ZONE_LIMIT_MIN = 5; // km/h
export const SPEED_ZONE_LIMIT_STEP = 1; // km/h
