import type { FederatedPointerEvent } from "pixi.js";
import { useCallback, useRef } from "react";

import { useNetworkStore } from "../../../entities/network";
import { type Camera, panCamera, screenToWorld } from "../../model/camera";
import { EditorTool } from "../../model/EditorTool";
import { handleCanvasTap } from "../../model/handleCanvasTap";
import { useEditorUiStore } from "../../store/editorUiStore";

const DRAG_THRESHOLD = 4;

interface DragState {
  isPan: boolean;
  moved: boolean;
  startScreenX: number;
  startScreenY: number;
  startCamera: Camera;
}

export function useCanvasPan() {
  const drag = useRef<DragState | null>(null);

  const handlePointerDown = useCallback((event: FederatedPointerEvent) => {
    const { tool, camera } = useEditorUiStore.getState();
    const isPan = tool === EditorTool.Pan || event.button === 1 || event.altKey;

    drag.current = {
      isPan,
      moved: false,
      startScreenX: event.global.x,
      startScreenY: event.global.y,
      startCamera: camera,
    };
  }, []);

  const handlePointerMove = useCallback((event: FederatedPointerEvent) => {
    const state = drag.current;

    if (!state) {
      return;
    }

    const dx = event.global.x - state.startScreenX;
    const dy = event.global.y - state.startScreenY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      state.moved = true;
    }
    if (state.isPan) {
      useEditorUiStore.getState().setCamera(panCamera(state.startCamera, dx, dy));
    }
  }, []);

  const endDrag = useCallback((event: FederatedPointerEvent, allowTap: boolean) => {
    const state = drag.current;
    drag.current = null;

    if (!state || !allowTap || state.isPan || state.moved || event.button !== 0) {
      return;
    }

    const editor = useEditorUiStore.getState();
    const network = useNetworkStore.getState();
    const world = screenToWorld(event.global.x, event.global.y, editor.camera);

    handleCanvasTap(
      world.x,
      world.y,
      {
        tool: editor.tool,
        zoom: editor.camera.zoom,
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
  }, []);

  const handlePointerUp = useCallback(
    (event: FederatedPointerEvent) => endDrag(event, true),
    [endDrag]
  );

  const handlePointerUpOutside = useCallback(
    (event: FederatedPointerEvent) => endDrag(event, false),
    [endDrag]
  );

  return { handlePointerDown, handlePointerMove, handlePointerUp, handlePointerUpOutside };
}
