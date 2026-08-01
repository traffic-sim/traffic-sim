import type { ReactNode } from "react";

import "../PropertiesPanel.css";

export function PanelSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="section">
      <div className="section-title">{label}</div>
      {children}
    </div>
  );
}
