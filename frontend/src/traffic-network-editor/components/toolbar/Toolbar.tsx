import { useEditorUiStore } from "../../store/editorUiStore";

import { TOOLS } from "./toolbarConfig";
import { useToolbarShortcuts } from "./useToolbarShortcuts";

import "./Toolbar.css";

export function Toolbar() {
  const tool = useEditorUiStore((s) => s.tool);
  const setTool = useEditorUiStore((s) => s.setTool);

  useToolbarShortcuts(setTool);

  return (
    <div className="toolbar">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          title={t.title}
          onClick={() => setTool(t.id)}
          className="toolbar-button"
          data-active={tool === t.id}
        >
          {t.icon}
        </button>
      ))}

      <div className="toolbar-divider" />

      {TOOLS.map((t) => (
        <div key={t.id} className="toolbar-key" data-active={tool === t.id}>
          {t.key}
        </div>
      ))}
    </div>
  );
}
