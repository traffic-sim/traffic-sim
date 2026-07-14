import { PixiCanvas } from "./components/PixiCanvas.tsx";
import "./TrafficNetworkEditorPage.css";

const EDITOR_HINT_TEXT =
  "Click to place a point. Click a second point to draw a straight road between them. " +
  "Click the same point twice to cancel.";

export function TrafficNetworkEditorPage() {
  return (
    <div className="traffic-network-editor-page">
      <div className="traffic-network-editor-page__hint">{EDITOR_HINT_TEXT}</div>
      <div className="traffic-network-editor-page__workspace">
        <PixiCanvas />
      </div>
    </div>
  );
}
