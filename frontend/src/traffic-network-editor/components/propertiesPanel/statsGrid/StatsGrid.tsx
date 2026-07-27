import { Fragment } from "react";

import "../../../../theme/panelTheme.css";
import "./StatsGrid.css";

export interface StatsGridRow {
  label: string;
  value: string;
}

export function StatsGrid({ rows }: { rows: StatsGridRow[] }) {
  return (
    <div className="section">
      <div className="stats-grid__table">
        {rows.map((row) => (
          <Fragment key={row.label}>
            <span className="stats-grid__label">{row.label}</span>
            <span className="stats-grid__value">{row.value}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
