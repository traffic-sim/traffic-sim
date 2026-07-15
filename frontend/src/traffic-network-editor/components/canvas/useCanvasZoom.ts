import type { FederatedWheelEvent } from "pixi.js";
import { useCallback } from "react";

import { zoomCamera } from "../../model/camera";
import { ZOOM_STEP } from "../../model/constants";
import { useEditorUiStore } from "../../store/editorUiStore";

export function useCanvasZoom() {
  return useCallback((event: FederatedWheelEvent) => {
    const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
    const { camera, setCamera } = useEditorUiStore.getState();

    setCamera(zoomCamera(camera, event.global.x, event.global.y, factor));
  }, []);
}
