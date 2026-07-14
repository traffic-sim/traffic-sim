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
