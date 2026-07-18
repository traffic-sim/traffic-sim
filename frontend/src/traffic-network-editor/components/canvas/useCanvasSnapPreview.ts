import type { FederatedPointerEvent } from "pixi.js";
import { useCallback } from "react";

import { useNetworkStore } from "../../../entities/network";
import { screenToWorld } from "../../model/camera";
import { ENDPOINT_SNAP_RADIUS } from "../../model/constants";
import { EditorTool } from "../../model/EditorTool";
import { getEffectiveGridSize } from "../../model/grid";
import { resolveSnap } from "../../model/snapping";
import { useEditorUiStore } from "../../store/editorUiStore";

export function useCanvasSnapPreview() {
  return useCallback((event: FederatedPointerEvent) => {
    const editor = useEditorUiStore.getState();

    if (editor.tool !== EditorTool.Draw) {
      return;
    }

    const world = screenToWorld(event.global.x, event.global.y, editor.camera);
    const nodes = useNetworkStore.getState().nodes;
    const gridSize = getEffectiveGridSize(editor.camera.zoom);

    const snap = resolveSnap(
      world.x,
      world.y,
      nodes,
      ENDPOINT_SNAP_RADIUS / editor.camera.zoom,
      gridSize
    );

    editor.setSnapPreview(snap);
  }, []);
}
