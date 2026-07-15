import { MAX_ZOOM, MIN_ZOOM } from "./constants";

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export const DEFAULT_CAMERA: Camera = { x: 0, y: 0, zoom: 1 };

export function screenToWorld(screenX: number, screenY: number, camera: Camera) {
  return {
    x: screenX / camera.zoom + camera.x,
    y: screenY / camera.zoom + camera.y,
  };
}

export function worldToScreen(worldX: number, worldY: number, camera: Camera) {
  return {
    x: (worldX - camera.x) * camera.zoom,
    y: (worldY - camera.y) * camera.zoom,
  };
}

export function panCamera(startCamera: Camera, dxScreen: number, dyScreen: number): Camera {
  return {
    x: startCamera.x - dxScreen / startCamera.zoom,
    y: startCamera.y - dyScreen / startCamera.zoom,
    zoom: startCamera.zoom,
  };
}

export function zoomCamera(
  camera: Camera,
  screenX: number,
  screenY: number,
  factor: number
): Camera {
  const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, camera.zoom * factor));
  if (nextZoom === camera.zoom) {
    return camera;
  }
  return {
    zoom: nextZoom,
    x: camera.x + screenX * (1 / camera.zoom - 1 / nextZoom),
    y: camera.y + screenY * (1 / camera.zoom - 1 / nextZoom),
  };
}
