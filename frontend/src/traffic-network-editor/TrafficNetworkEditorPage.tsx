import { PixiCanvas } from "./components/canvas";
import { PropertiesPanel } from "./components/propertiesPanel/PropertiesPanel";
import { Toolbar } from "./components/toolbar";

import "./TrafficNetworkEditorPage.css";

const EDITOR_HINT_TEXT =
  "Click to place a point. Click a second point to draw a straight road between them. " +
  "Click the same point twice to cancel.";

export function TrafficNetworkEditorPage() {
  return (
    <div className="traffic-network-editor-page">
      <div className="traffic-network-editor-page__hint">{EDITOR_HINT_TEXT}</div>
      <div className="traffic-network-editor-page__workspace">
        <Toolbar />
        <PixiCanvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}
