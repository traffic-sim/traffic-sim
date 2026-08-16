import { MiniLineChart } from "../../../../../components";
import {
  niceYMax,
  sampleFundamentalDiagram,
  type TriangularFdParams,
} from "../../../../../entities/network";

// vFree/rhoCritical/rhoJam are stored directly in km/h and veh/km — the
// triangular FD formula is unit-agnostic (q = v·ρ works the same regardless
// of which units v and ρ are in, as long as they're consistent), so no
// conversion is needed here at all; q comes out in veh/h.
export function FundamentalDiagramChart({ params }: { params: TriangularFdParams }) {
  const data = sampleFundamentalDiagram(params).map((p) => ({ x: p.rho, y: p.q }));
  const peak = Math.max(...data.map((p) => p.y));

  return (
    <MiniLineChart
      data={data}
      caption="q(ρ) = min(v_free · ρ, w · (ρ_jam − ρ))"
      xLabel="ρ (veh/km)"
      yDomain={[0, niceYMax(peak)]}
      referenceLines={[{ x: params.rhoCritical, color: "var(--blue)" }]}
      tooltip={{
        formatValue: (value) => value.toFixed(1),
        valueLabel: "flow q",
        formatLabel: (label) => `ρ = ${label.toFixed(1)}`,
      }}
    />
  );
}
