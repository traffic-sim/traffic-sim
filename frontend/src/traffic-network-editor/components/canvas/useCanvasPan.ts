import type { FederatedPointerEvent } from "pixi.js";
import { useCallback, useRef } from "react";

import { type Camera, panCamera } from "../../model/camera";
import { EditorTool } from "../../model/EditorTool";
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
      const { setCamera } = useEditorUiStore.getState();
      setCamera(panCamera(state.startCamera, dx, dy));
    }
  }, []);

  const endDrag = useCallback(
    (event: FederatedPointerEvent, shouldTriggerTap: boolean): boolean => {
      const state = drag.current;
      drag.current = null;

      return !!state && shouldTriggerTap && !state.isPan && !state.moved && event.button === 0;
    },
    []
  );

  return {
    drag,
    handlePointerDown,
    handlePointerMove,
    endDrag,
  };
}
