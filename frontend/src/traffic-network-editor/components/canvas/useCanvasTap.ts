import type { FederatedPointerEvent } from "pixi.js";
import { useCallback } from "react";

import { useNetworkStore } from "../../../entities/network";
import { type Camera, screenToWorld } from "../../model/camera";
import { handleCanvasTap } from "../../model/handleCanvasTap";
import { useEditorUiStore } from "../../store/editorUiStore";

export function useCanvasTap(camera: Camera) {
  return useCallback(
    (event: FederatedPointerEvent) => {
      const world = screenToWorld(event.global.x, event.global.y, camera);

      const network = useNetworkStore.getState();
      const editor = useEditorUiStore.getState();

      handleCanvasTap(
        world.x,
        world.y,
        {
          tool: editor.tool,
          selectedNodeId: editor.selectedNodeId,
          nodes: network.nodes,
          edges: network.edges,
        },
        {
          addNode: network.addNode,
          addEdge: network.addEdge,
          selectNode: editor.selectNode,
          selectEdge: editor.selectEdge,
          clearSelection: editor.clearSelection,
        }
      );
    },
    [camera]
  );
}
