import { Colors } from "../../theme/colors";

// ── 1. Semantic color aliases ─────────────────────────────────────
export const COLORS = {
  background: Colors.gray100,
  road: Colors.gray500,
  roadFill: Colors.gray400,
  roadFillSelected: Colors.blueLight,
  nodeDefault: Colors.white,
  nodeSelected: Colors.blue,
  nodeStroke: Colors.blue,
  gridFine: Colors.gray200,
  gridMajor: Colors.gray300,
  snapIndicator: Colors.blue,
  dash: Colors.black,
} as const;

// ── 2. Road geometry ────────────────────────────────────────────────
export const ROAD_WIDTH = 14;
export const ROAD_HIGHLIGHT_WIDTH = ROAD_WIDTH + 9;
export const ROAD_HIGHLIGHT_ALPHA = 0.15;
export const DASH_LENGTH = 7;
export const DASH_GAP = 5;
export const DASH_ALPHA = 0.1;
export const DASH_STROKE_WIDTH = 0.8;

// ── 3. Node geometry ──────────────────────────────────────────────
export const NODE_RADIUS = 8;
export const NODE_STROKE_WIDTH = 2;

// ── 4. Snap indicator ─────────────────────────────────────────────
export const SNAP_ENDPOINT_RADIUS = 11;
export const SNAP_ENDPOINT_STROKE_WIDTH = 1.5;
export const SNAP_ENDPOINT_ALPHA = 0.8;
export const SNAP_CROSSHAIR_SIZE = 6;
export const SNAP_GRID_STROKE_WIDTH = 1.2;
export const SNAP_GRID_ALPHA = 0.7;
