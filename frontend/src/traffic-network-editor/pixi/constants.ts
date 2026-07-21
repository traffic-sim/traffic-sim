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
  intersectionNode: Colors.blueSlate,
  badgeText: Colors.white,
  intersectionBadgePlate: Colors.amber,
  sourceBadgePlate: Colors.green,
  sinkBadgePlate: Colors.purple,
  gridFine: Colors.gray200,
  gridMajor: Colors.gray300,
  label: Colors.gray600,
  hintText: Colors.blue,
  snapIndicator: Colors.blue,
  drawPreview: Colors.blue,
  scaleBar: Colors.gray700,
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

// ── Badge ─────────────────────────────────────────────────────────
export const BADGE_FONT_SIZE = 11;
export const BADGE_PLATE_RADIUS = 8;

// ── 4. Arrow ──────────────────────────────────────────────────────
export const ARROW_SIZE = 6;
export const ARROW_BACKSTEP_RATIO = 0.4;
export const ARROW_HALF_WIDTH_RATIO = 0.7;

// ── 5. Snap indicator ─────────────────────────────────────────────
export const SNAP_ENDPOINT_RADIUS = 11;
export const SNAP_ENDPOINT_STROKE_WIDTH = 1.5;
export const SNAP_ENDPOINT_ALPHA = 0.8;
export const SNAP_CROSSHAIR_SIZE = 6;
export const SNAP_GRID_STROKE_WIDTH = 1.2;
export const SNAP_GRID_ALPHA = 0.7;

// ── 6. Draw preview ───────────────────────────────────────────────
export const PREVIEW_LINE_WIDTH = 2;
export const PREVIEW_LINE_ALPHA = 0.5;

// ── 7. Scale bar ──────────────────────────────────────────────────
export const SCALE_BAR_MARGIN = 16;
export const SCALE_BAR_TARGET_PX = 80;
export const SCALE_BAR_OVERSHOOT_FACTOR = 1.4;
export const SCALE_BAR_STROKE_WIDTH = 1.2;
export const SCALE_BAR_TEXT_OFFSET = 16;

// ── 8. Scale bar ──────────────────────────────────────────────────
export const ROAD_LABEL_OFFSET = 16;

// ── 9. Zoom thresholds ────────────────────────────────────────────
export const ROAD_LABEL_MIN_ZOOM = 0.4;
