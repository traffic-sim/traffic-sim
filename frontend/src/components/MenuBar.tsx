import type { Key } from "react";

import "./MenuBar.css";

export interface MenuBarTab<T extends Key> {
  id: T;
  label: string;
}

interface MenuBarProps<T extends Key> {
  brand: string;
  tabs: readonly MenuBarTab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export function MenuBar<T extends Key>({ brand, tabs, activeTab, onTabChange }: MenuBarProps<T>) {
  return (
    <div className="menubar">
      <div className="menubar-brand">
        <span className="brand-name">{brand}</span>
      </div>
      <div className="menubar-sep" />
      <nav className="menubar-tabs">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            className={`tab ${activeTab === id ? "tab-active" : ""}`}
            onClick={() => onTabChange(id)}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
