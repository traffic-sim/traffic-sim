import type { FederatedPointerEvent } from "pixi.js";
import { useCallback } from "react";

import { useNetworkStore } from "../../../entities/network";
import { screenToWorld } from "../../model/camera";
import { handleCanvasTap } from "../../model/handleCanvasTap";
import { useEditorUiStore } from "../../store/editorUiStore";

export function useCanvasTap() {
  return useCallback((event: FederatedPointerEvent) => {
    const editor = useEditorUiStore.getState();
    const network = useNetworkStore.getState();
    const world = screenToWorld(event.global.x, event.global.y, editor.camera);

    handleCanvasTap(
      world.x,
      world.y,
      {
        tool: editor.tool,
        drawStartNodeId: editor.drawStartNodeId,
        nodes: network.nodes,
        edges: network.edges,
        zoom: editor.camera.zoom,
      },
      {
        addNode: network.addNode,
        addEdge: network.addEdge,
        setDrawStartNodeId: editor.setDrawStartNodeId,
        selectNode: editor.selectNode,
        selectEdge: editor.selectEdge,
        clearSelection: editor.clearSelection,
      }
    );
  }, []);
}
