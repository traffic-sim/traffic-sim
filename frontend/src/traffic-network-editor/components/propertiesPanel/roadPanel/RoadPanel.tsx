import { LabeledSlider } from "../../../../components";
import {
  CELL_COUNT_RANGE,
  DEFAULT_EDGE_PROPERTIES,
  RHO_CRITICAL_RANGE,
  RHO_JAM_RANGE,
  useNetworkStore,
  V_FREE_RANGE,
  type RoadEdge,
} from "../../../../entities/network";
import { useEditorUiStore } from "../../../store/editorUiStore";
import { FlipIcon } from "../../icons/FlipIcon";
import { ResetIcon } from "../../icons/ResetIcon";
import { TrashIcon } from "../../icons/TrashIcon";
import { PanelSection } from "../panelSection/PanelSection";
import { StatsGrid } from "../statsGrid/StatsGrid";

import { FundamentalDiagramChart } from "./fundamentalDiagramChart/FundamentalDiagramChart";
import { SpeedZoneEditor } from "./speedZoneEditor/SpeedZoneEditor";

import "../PropertiesPanel.css";

function distanceBetween(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function RoadPanel({ edge }: { edge: RoadEdge }) {
  const nodes = useNetworkStore((s) => s.nodes);
  const updateEdge = useNetworkStore((s) => s.updateEdge);
  const removeEdge = useNetworkStore((s) => s.removeEdge);
  const flipEdgeDirection = useNetworkStore((s) => s.flipEdgeDirection);
  const clearSelection = useEditorUiStore((s) => s.clearSelection);
  const setExpandedSpeedZoneIndex = useEditorUiStore((s) => s.setExpandedSpeedZoneIndex);

  const from = nodes[edge.from];
  const to = nodes[edge.to];
  const length = from && to ? distanceBetween(from.position, to.position) : 0;
  const pxPerCell = edge.cells > 0 ? length / edge.cells : 0;

  function handleDelete() {
    removeEdge(edge.id);
    clearSelection();
  }

  function handleReset() {
    updateEdge(edge.id, { ...DEFAULT_EDGE_PROPERTIES });
    setExpandedSpeedZoneIndex(null);
  }

  return (
    <>
      <div className="panel-titlebar">
        <div className="panel-header-name">
          <span className="panel-title">Road</span>
          <input
            type="text"
            className="inline-name-input"
            value={edge.name}
            onChange={(e) => updateEdge(edge.id, { name: e.target.value })}
          />
        </div>
        <div className="panel-header-actions">
          <button
            className="btn-icon"
            title="Flip road direction"
            onClick={() => flipEdgeDirection(edge.id)}
          >
            <FlipIcon />
          </button>
          <button className="btn-icon" title="Reset to defaults" onClick={handleReset}>
            <ResetIcon />
          </button>
          <button
            className="btn-icon btn-icon--danger"
            title="Delete road (Del)"
            onClick={handleDelete}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="panel-body">
        <StatsGrid
          rows={[
            { label: "Length", value: `${length.toFixed(1)} m` },
            { label: "Δx (per cell)", value: `${pxPerCell.toFixed(2)} m` },
          ]}
        />

        <PanelSection label="Physical Parameters">
          <div className="field-stack">
            <LabeledSlider
              label="Free-flow speed"
              value={edge.vFree}
              displayValue={`${edge.vFree.toFixed(0)} km/h`}
              min={V_FREE_RANGE.min}
              max={V_FREE_RANGE.max}
              step={V_FREE_RANGE.step}
              onChange={(v) => updateEdge(edge.id, { vFree: v })}
            />
            <LabeledSlider
              label="Critical density"
              value={edge.rhoCritical}
              displayValue={`${edge.rhoCritical.toFixed(0)} veh/km`}
              min={RHO_CRITICAL_RANGE.min}
              max={Math.min(RHO_CRITICAL_RANGE.max, edge.rhoJam)}
              step={RHO_CRITICAL_RANGE.step}
              onChange={(v) => updateEdge(edge.id, { rhoCritical: Math.min(v, edge.rhoJam) })}
            />
            <LabeledSlider
              label="Jam density"
              value={edge.rhoJam}
              displayValue={`${edge.rhoJam.toFixed(0)} veh/km`}
              min={Math.max(RHO_JAM_RANGE.min, edge.rhoCritical)}
              max={RHO_JAM_RANGE.max}
              step={RHO_JAM_RANGE.step}
              onChange={(v) => updateEdge(edge.id, { rhoJam: Math.max(v, edge.rhoCritical) })}
            />
            <LabeledSlider
              label="Cell count"
              value={edge.cells}
              displayValue={`${edge.cells}`}
              min={CELL_COUNT_RANGE.min}
              max={CELL_COUNT_RANGE.max}
              step={CELL_COUNT_RANGE.step}
              onChange={(v) => updateEdge(edge.id, { cells: v })}
            />
          </div>
        </PanelSection>

        <PanelSection label="Fundamental Diagram">
          <FundamentalDiagramChart
            params={{ vFree: edge.vFree, rhoCritical: edge.rhoCritical, rhoJam: edge.rhoJam }}
          />
        </PanelSection>

        <PanelSection label="Speed Zones">
          <SpeedZoneEditor edge={edge} />
        </PanelSection>
      </div>
    </>
  );
}
