import type { FederatedPointerEvent } from "pixi.js";
import { useCallback } from "react";

import { useNetworkStore } from "../../../entities/network";
import { handleCanvasTap } from "../../pixi/handleCanvasTap";
import { useEditorUiStore } from "../../store/editorUiStore";

export function useCanvasTap() {
  return useCallback((event: FederatedPointerEvent) => {
    const network = useNetworkStore.getState();
    const editor = useEditorUiStore.getState();

    handleCanvasTap(
      event.global.x,
      event.global.y,
      {
        selectedNodeId: editor.selectedNodeId,
        nodes: network.nodes,
      },
      {
        addNode: network.addNode,
        addEdge: network.addEdge,
        selectNode: editor.selectNode,
      }
    );
  }, []);
}
