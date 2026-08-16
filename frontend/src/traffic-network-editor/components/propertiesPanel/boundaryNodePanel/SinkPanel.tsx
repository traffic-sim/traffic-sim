import { LabeledSlider } from "../../../../components";
import {
  DEFAULT_SINK_CAPACITY,
  SINK_CAPACITY_RANGE,
  useNetworkStore,
  type BoundaryNode,
  type SinkRole,
} from "../../../../entities/network";
import { useEditorUiStore } from "../../../store/editorUiStore";
import { ResetIcon } from "../../icons/ResetIcon";
import { TrashIcon } from "../../icons/TrashIcon";
import { PanelSection } from "../panelSection/PanelSection";

import { SinkCapacityChart } from "./sinkCapacityChart/SinkCapacityChart";

import "../PropertiesPanel.css";
import "./SinkPanel.css";

export function SinkPanel({ node, role }: { node: BoundaryNode; role: SinkRole }) {
  const updateBoundaryNode = useNetworkStore((s) => s.updateBoundaryNode);
  const updateBoundaryRole = useNetworkStore((s) => s.updateBoundaryRole);
  const removeNode = useNetworkStore((s) => s.removeNode);
  const clearSelection = useEditorUiStore((s) => s.clearSelection);

  function handleReset() {
    updateBoundaryRole(node.nodeId, { capacity: DEFAULT_SINK_CAPACITY, unlimited: true });
  }

  function handleDelete() {
    removeNode(node.nodeId);
    clearSelection();
  }

  return (
    <>
      <div className="panel-titlebar">
        <div className="panel-header-name">
          <span className="panel-title">Sink</span>
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
        <PanelSection label="Capacity">
          <label className="sink-panel__checkbox-row">
            <input
              type="checkbox"
              checked={role.unlimited}
              onChange={(e) => updateBoundaryRole(node.nodeId, { unlimited: e.target.checked })}
            />
            <span>Unlimited capacity — every car is accepted</span>
          </label>

          {!role.unlimited && (
            <>
              <LabeledSlider
                label="Max vehicles"
                value={role.capacity}
                displayValue={`${role.capacity} veh`}
                min={SINK_CAPACITY_RANGE.min}
                max={SINK_CAPACITY_RANGE.max}
                step={SINK_CAPACITY_RANGE.step}
                onChange={(v) => updateBoundaryRole(node.nodeId, { capacity: v })}
              />
              <SinkCapacityChart capacity={role.capacity} />
            </>
          )}
        </PanelSection>
      </div>
    </>
  );
}
