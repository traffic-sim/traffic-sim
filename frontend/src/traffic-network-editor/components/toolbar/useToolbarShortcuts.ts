import { useEffect } from "react";

import { useNetworkStore } from "../../../entities/network";
import { EditorTool } from "../../model/EditorTool";
import { handleDeleteSelection } from "../../model/handleDeleteSelection";
import { useEditorUiStore } from "../../store/editorUiStore";

export function useToolbarShortcuts(setTool: (tool: EditorTool) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) {
        return;
      }

      switch (e.key) {
        case "v":
        case "V":
          setTool(EditorTool.Select);
          break;
        case "r":
        case "R":
          setTool(EditorTool.Draw);
          break;
        case "h":
        case "H":
          setTool(EditorTool.Pan);
          break;
        case "Delete":
        case "Backspace": {
          const network = useNetworkStore.getState();
          const editor = useEditorUiStore.getState();

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
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setTool]);
}
