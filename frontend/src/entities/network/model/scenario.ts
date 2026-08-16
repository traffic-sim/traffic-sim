import type { ScenarioType, TrafficScenario } from "./types";

export const SCENARIO_LABELS: Record<ScenarioType, string> = {
  constant: "Constant",
  sinusoidal: "Sinusoidal Wave",
  nyc_peak: "NYC Rush Hour",
  random_pulse: "Random Pulses",
  ramp_up: "Ramp-Up",
};

export function computeScenarioInflow(scenario: TrafficScenario, step: number): number {
  const { type, baseInflow, amplitude, period } = scenario;

  switch (type) {
    case "constant":
      return baseInflow;
    case "sinusoidal":
      return baseInflow * (1 + amplitude * Math.sin((2 * Math.PI * step) / Math.max(period, 1)));
    case "nyc_peak": {
      const phase = (step % Math.max(period, 1)) / Math.max(period, 1);
      const morning = Math.exp(-Math.pow((phase - 0.33) / 0.08, 2));
      const evening = Math.exp(-Math.pow((phase - 0.75) / 0.08, 2));
      return baseInflow * (1 - amplitude + amplitude * Math.max(morning, evening) * 2.5);
    }
    case "random_pulse": {
      const bucket = Math.floor(step / Math.max(period / 10, 1));
      const h = ((bucket * 1664525 + 1013904223) & 0xffffffff) >>> 0;
      const rand = (h % 1000) / 1000;
      return rand < amplitude ? baseInflow * 2.5 : baseInflow * 0.1;
    }
    case "ramp_up": {
      const phase = (step % Math.max(period, 1)) / Math.max(period, 1);
      return baseInflow * (1 - amplitude + amplitude * phase * 2);
    }
    default:
      return baseInflow;
  }
}
