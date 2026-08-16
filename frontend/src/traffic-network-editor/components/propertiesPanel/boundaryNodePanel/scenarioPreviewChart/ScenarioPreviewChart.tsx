import { MiniLineChart } from "../../../../../components";
import {
  computeScenarioInflow,
  niceYMax,
  type TrafficScenario,
} from "../../../../../entities/network";

const SAMPLE_COUNT = 120;
const DEFAULT_WINDOW_STEPS = 60;
const MIN_WINDOW_STEPS = 40;
const MAX_WINDOW_STEPS = 4000;

function previewWindowSteps(scenario: TrafficScenario): number {
  if (scenario.type === "constant") {
    return DEFAULT_WINDOW_STEPS;
  }

  return Math.min(MAX_WINDOW_STEPS, Math.max(MIN_WINDOW_STEPS, scenario.period * 2));
}

export function ScenarioPreviewChart({ scenario }: { scenario: TrafficScenario }) {
  const windowSteps = previewWindowSteps(scenario);
  const sampleStep = windowSteps / SAMPLE_COUNT;

  const data = Array.from({ length: SAMPLE_COUNT + 1 }, (_, i) => {
    const x = i * sampleStep;

    return { x, y: Math.max(0, computeScenarioInflow(scenario, x)) };
  });

  const peak = Math.max(...data.map((p) => p.y));

  const xTicks =
    scenario.type === "constant"
      ? undefined
      : [0, scenario.period, Math.min(2 * scenario.period, windowSteps)];

  return (
    // Keying on the scenario type means dragging
    // baseInflow/amplitude/period never remounts or re-animates this chart
    // - it just updates live. Changing the type is a genuine shape change
    // though, so that's worth a fresh draw-in: the key change mounts a new
    // MiniLineChart instance, which plays its entrance animation once.
    <MiniLineChart
      key={scenario.type}
      data={data}
      caption={`q(t) preview (${windowSteps.toFixed(0)} steps)`}
      xLabel="steps"
      yDomain={[0, niceYMax(peak)]}
      xTicks={xTicks}
      tooltip={{
        formatValue: (value) => `${value.toFixed(0)} veh/h`,
        valueLabel: "inflow q",
        formatLabel: (label) => `t = ${label.toFixed(0)}`,
      }}
    />
  );
}
