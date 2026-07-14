import { useState } from "react";

import { MenuBar, type MenuBarTab } from "./components/MenuBar";
import { TrafficNetworkEditorPage } from "./traffic-network-editor";

import "./App.css";

enum View {
  Editor,
  Simulation,
}

const VIEW_TABS: readonly MenuBarTab<View>[] = [
  { id: View.Editor, label: "Network Editor" },
  { id: View.Simulation, label: "Simulation" },
];

export function App() {
  const [view, setView] = useState<View>(View.Editor);

  return (
    <div className="app">
      <MenuBar brand="TrafficFlow" tabs={VIEW_TABS} activeTab={view} onTabChange={setView} />

      <div className="content">
        {view === View.Editor ? (
          <TrafficNetworkEditorPage />
        ) : (
          <div className="placeholder-view">Simulation view not built yet.</div>
        )}
      </div>
    </div>
  );
}
