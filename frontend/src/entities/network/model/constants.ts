import type { TrafficScenario } from "./types";

export const DEFAULT_SCENARIO: TrafficScenario = {
  type: "constant",
  baseInflow: 0.3,
  amplitude: 0.5,
  period: 300,
};

export const DEFAULT_SINK_CAPACITY = 50;
