import { MiniLineChart } from "../../../../../components";
import { sampleFundamentalDiagram, type TriangularFdParams } from "../../../../../entities/network";

import "./FundamentalDiagramChart.css";

// vFree/rhoCritical/rhoJam are stored directly in km/h and veh/km — the
// triangular FD formula is unit-agnostic (q = v·ρ works the same regardless
// of which units v and ρ are in, as long as they're consistent), so no
// conversion is needed here at all; q comes out in veh/h.
export function FundamentalDiagramChart({ params }: { params: TriangularFdParams }) {
  const data = sampleFundamentalDiagram(params).map((p) => ({ x: p.rho, y: p.q }));

  return (
    <div>
      <div className="fd-chart__formula">q(ρ) = min(v_free · ρ, w · (ρ_jam − ρ))</div>
      <MiniLineChart
        data={data}
        height={105}
        showAxes
        showGrid
        xLabel="ρ (veh/km)"
        yLabel="q"
        margin={{ top: 12, right: 4, bottom: 10, left: 24 }}
        yAxisWidth={26}
        referenceLines={[{ x: params.rhoCritical, color: "#0047ab" }]}
        tooltip={{
          formatValue: (value) => value.toFixed(1),
          valueLabel: "flow q",
          formatLabel: (label) => `ρ = ${label.toFixed(1)}`,
        }}
      />
    </div>
  );
}
