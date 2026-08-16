import type { ReactNode } from "react";

import "../PropertiesPanel.css";

export function PanelSection({
  label,
  badge,
  children,
}: {
  label: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="section">
      <div className="section-title">
        <span>{label}</span>
        {badge}
      </div>
      {children}
    </div>
  );
}
