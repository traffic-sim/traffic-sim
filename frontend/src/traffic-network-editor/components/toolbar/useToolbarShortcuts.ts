import { useEffect } from "react";

import { useNetworkStore } from "../../../entities/network";
import { EditorTool } from "../../model/EditorTool";
import { handleDeleteSelection } from "../../model/handleDeleteSelection";
import { useEditorUiStore } from "../../store/editorUiStore";

export function useToolbarShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) {
        return;
      }

      const editor = useEditorUiStore.getState();

      switch (e.key) {
        case "v":
        case "V":
          editor.setTool(EditorTool.Select);
          break;
        case "r":
        case "R":
          editor.setTool(EditorTool.Draw);
          break;
        case "h":
        case "H":
          editor.setTool(EditorTool.Pan);
          break;
        case "Delete":
        case "Backspace": {
          const network = useNetworkStore.getState();

          handleDeleteSelection(
            {
              selectedNodeId: editor.selectedNodeId,
              selectedEdgeId: editor.selectedEdgeId,
            },
            {
              removeNode: network.removeNode,
              removeEdge: network.removeEdge,
              clearSelection: editor.clearSelection,
            }
          );
          break;
        }
        case "Escape":
          useEditorUiStore.getState().clearSelection();
          useEditorUiStore.getState().setDrawStartNodeId(null);
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
