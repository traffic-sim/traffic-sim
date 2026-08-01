import { LabeledSlider } from "../../../../../components";
import {
  clampZoneFromT,
  clampZoneToT,
  findFreeGapForNewZone,
  getZoneDragBounds,
  SPEED_ZONE_LIMIT_MIN,
  SPEED_ZONE_LIMIT_STEP,
  useNetworkStore,
  type RoadEdge,
} from "../../../../../entities/network";
import { useEditorUiStore } from "../../../../store/editorUiStore";
import { SpeedZoneStrip } from "../speedZoneStrip/SpeedZoneStrip";

import "./SpeedZoneEditor.css";

function formatToPercentage(num: number) {
  return (num * 100).toFixed(0);
}

export function SpeedZoneEditor({ edge }: { edge: RoadEdge }) {
  const updateEdge = useNetworkStore((s) => s.updateEdge);
  const editing = useEditorUiStore((s) => s.expandedSpeedZoneIndex);
  const setEditing = useEditorUiStore((s) => s.setExpandedSpeedZoneIndex);

  function patchZone(i: number, patch: Partial<{ fromT: number; toT: number; limit: number }>) {
    const next = [...edge.speedZones];
    const merged = { ...next[i], ...patch };

    if (patch.fromT !== undefined) {
      merged.fromT = clampZoneFromT(edge.speedZones, i, merged.fromT);
    }
    if (patch.toT !== undefined) {
      merged.toT = clampZoneToT(edge.speedZones, i, merged.toT);
    }

    next[i] = merged;
    updateEdge(edge.id, { speedZones: next });
  }

  function removeZone(i: number) {
    updateEdge(edge.id, { speedZones: edge.speedZones.filter((_, j) => j !== i) });
    setEditing(null);
  }

  const freeGap = findFreeGapForNewZone(edge.speedZones);

  function addZone() {
    if (!freeGap) {
      return;
    }
    updateEdge(edge.id, {
      speedZones: [...edge.speedZones, { ...freeGap, limit: edge.vFree * 0.5 }],
    });
    setEditing(edge.speedZones.length);
  }

  return (
    <div>
      <SpeedZoneStrip
        speedZones={edge.speedZones}
        vFree={edge.vFree}
        onSelect={(i) => setEditing(editing === i ? null : i)}
      />

      {edge.speedZones.map((z, i) => {
        const bounds = getZoneDragBounds(edge.speedZones, i);

        return (
          <div
            key={i}
            className={`speed-zone-item ${editing === i ? "speed-zone-item--active" : ""}`}
          >
            <div className="speed-zone-item__header">
              <button
                type="button"
                className="speed-zone-item__toggle"
                onClick={() => setEditing(editing === i ? null : i)}
              >
                <span className="speed-zone-item__title">
                  Zone {i + 1}: {z.limit.toFixed(0)} km/h · {formatToPercentage(z.fromT)}%–
                  {formatToPercentage(z.toT)}%
                </span>
              </button>
              <button
                type="button"
                className="speed-zone-item__delete"
                aria-label={`Delete zone ${i + 1}`}
                onClick={() => removeZone(i)}
              >
                ×
              </button>
            </div>

            {editing === i && (
              <div className="speed-zone-item__body">
                <LabeledSlider
                  label="From"
                  value={z.fromT}
                  displayValue={`${formatToPercentage(z.fromT)}%`}
                  min={bounds.lower}
                  max={z.toT}
                  step={0.01}
                  onChange={(v) => patchZone(i, { fromT: v })}
                />
                <LabeledSlider
                  label="To"
                  value={z.toT}
                  displayValue={`${formatToPercentage(z.toT)}%`}
                  min={z.fromT}
                  max={bounds.upper}
                  step={0.01}
                  onChange={(v) => patchZone(i, { toT: v })}
                />
                <LabeledSlider
                  label="Limit"
                  value={z.limit}
                  displayValue={`${z.limit.toFixed(0)} km/h`}
                  min={SPEED_ZONE_LIMIT_MIN}
                  max={edge.vFree}
                  step={SPEED_ZONE_LIMIT_STEP}
                  onChange={(v) => patchZone(i, { limit: Math.min(v, edge.vFree) })}
                />
              </div>
            )}
          </div>
        );
      })}

      <button className="speed-zone-add-btn" onClick={addZone} disabled={!freeGap}>
        + Add Speed Zone
      </button>
    </div>
  );
}
