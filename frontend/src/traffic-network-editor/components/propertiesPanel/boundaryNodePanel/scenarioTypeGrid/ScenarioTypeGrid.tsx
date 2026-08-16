import { SCENARIO_LABELS, type ScenarioType } from "../../../../../entities/network";

import "./ScenarioTypeGrid.css";

export function ScenarioTypeGrid({
  value,
  onChange,
}: {
  value: ScenarioType;
  onChange: (type: ScenarioType) => void;
}) {
  return (
    <div className="scenario-type-grid">
      {(Object.entries(SCENARIO_LABELS) as [ScenarioType, string][]).map(([key, label]) => (
        <button
          key={key}
          className={`scenario-type-grid__button ${
            value === key ? "scenario-type-grid__button--active" : ""
          }`}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
