import { ask } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import { useEffect, useState } from "react";

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

async function checkForUpdates() {
  const update = await check();

  if (!update) {
    return;
  }

  const yes = await ask(
    `Version ${update.version} is available.\n\nRelease notes:\n${update.body}\n\nInstall now?`,
    { title: "Update Available", kind: "info" }
  );

  if (yes) {
    await update.downloadAndInstall();
    await relaunch();
  }
}

export function App() {
  const [view, setView] = useState<View>(View.Editor);

  useEffect(() => {
    checkForUpdates().catch(console.error);
  }, []);

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
