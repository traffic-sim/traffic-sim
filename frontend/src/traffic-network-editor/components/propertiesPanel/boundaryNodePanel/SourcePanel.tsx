import { LabeledSlider } from "../../../../components";
import {
  AMPLITUDE_RANGE,
  BASE_INFLOW_RANGE,
  DEFAULT_SCENARIO,
  PERIOD_RANGE,
  SCENARIO_LABELS,
  useNetworkStore,
  type BoundaryNode,
  type SourceRole,
} from "../../../../entities/network";
import { useEditorUiStore } from "../../../store/editorUiStore";
import { ResetIcon } from "../../icons/ResetIcon";
import { TrashIcon } from "../../icons/TrashIcon";
import { PanelSection } from "../panelSection/PanelSection";

import { ScenarioPreviewChart } from "./scenarioPreviewChart/ScenarioPreviewChart";
import { ScenarioTypeGrid } from "./scenarioTypeGrid/ScenarioTypeGrid";

import "../PropertiesPanel.css";

export function SourcePanel({ node, role }: { node: BoundaryNode; role: SourceRole }) {
  const updateBoundaryNode = useNetworkStore((s) => s.updateBoundaryNode);
  const updateBoundaryRole = useNetworkStore((s) => s.updateBoundaryRole);
  const removeNode = useNetworkStore((s) => s.removeNode);
  const clearSelection = useEditorUiStore((s) => s.clearSelection);

  const scenario = role.scenario;

  function patchScenario(patch: Partial<typeof scenario>) {
    updateBoundaryRole(node.nodeId, { scenario: { ...scenario, ...patch } });
  }

  function handleReset() {
    updateBoundaryRole(node.nodeId, { scenario: { ...DEFAULT_SCENARIO } });
  }

  function handleDelete() {
    removeNode(node.nodeId);
    clearSelection();
  }

  return (
    <>
      <div className="panel-titlebar">
        <div className="panel-header-name">
          <span className="panel-title">Source</span>
          <input
            type="text"
            className="inline-name-input"
            value={node.name}
            onChange={(e) => updateBoundaryNode(node.nodeId, { name: e.target.value })}
          />
        </div>
        <div className="panel-header-actions">
          <button className="btn-icon" title="Reset to defaults" onClick={handleReset}>
            <ResetIcon />
          </button>
          <button
            className="btn-icon btn-icon--danger"
            title="Delete node (Del)"
            onClick={handleDelete}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="panel-body">
        <PanelSection
          label="Traffic Scenario"
          badge={<span className="pill-badge">{SCENARIO_LABELS[scenario.type]}</span>}
        >
          <ScenarioTypeGrid value={scenario.type} onChange={(type) => patchScenario({ type })} />

          <div className="field-stack">
            <LabeledSlider
              label="Base inflow"
              value={scenario.baseInflow}
              displayValue={`${scenario.baseInflow.toFixed(0)} veh/h`}
              min={BASE_INFLOW_RANGE.min}
              max={BASE_INFLOW_RANGE.max}
              step={BASE_INFLOW_RANGE.step}
              onChange={(v) => patchScenario({ baseInflow: v })}
            />

            {scenario.type !== "constant" && (
              <>
                <LabeledSlider
                  label="Amplitude"
                  value={scenario.amplitude}
                  displayValue={scenario.amplitude.toFixed(2)}
                  min={AMPLITUDE_RANGE.min}
                  max={AMPLITUDE_RANGE.max}
                  step={AMPLITUDE_RANGE.step}
                  onChange={(v) => patchScenario({ amplitude: v })}
                />
                <LabeledSlider
                  label="Period (steps)"
                  value={scenario.period}
                  displayValue={`${scenario.period}`}
                  min={PERIOD_RANGE.min}
                  max={PERIOD_RANGE.max}
                  step={PERIOD_RANGE.step}
                  onChange={(v) => patchScenario({ period: v })}
                />
              </>
            )}
          </div>

          <ScenarioPreviewChart scenario={scenario} />
        </PanelSection>
      </div>
    </>
  );
}
