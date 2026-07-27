import type { SpeedZone } from "./types";

const DEFAULT_ZONE_WIDTH = 0.3;
const MIN_GAP = 0.02;

function neighborBounds(zones: SpeedZone[], index: number): { lower: number; upper: number } {
  const current = zones[index];
  let lower = 0;
  let upper = 1;

  zones.forEach((zone, i) => {
    if (i === index) {
      return;
    }
    if (zone.toT <= current.fromT) {
      lower = Math.max(lower, zone.toT);
    }
    if (zone.fromT >= current.toT) {
      upper = Math.min(upper, zone.fromT);
    }
  });

  return { lower, upper };
}

export function getZoneDragBounds(
  zones: SpeedZone[],
  index: number
): { lower: number; upper: number } {
  return neighborBounds(zones, index);
}

export function clampZoneFromT(zones: SpeedZone[], index: number, proposed: number): number {
  const { lower } = neighborBounds(zones, index);
  const current = zones[index];

  return Math.min(Math.max(proposed, lower), current.toT);
}

export function clampZoneToT(zones: SpeedZone[], index: number, proposed: number): number {
  const { upper } = neighborBounds(zones, index);
  const current = zones[index];

  return Math.max(Math.min(proposed, upper), current.fromT);
}

/**
 * Finds the largest unoccupied [fromT, toT] gap across all existing zones,
 * and sizes a new zone to fit within it (capped at the default width, or
 * filling the gap entirely if it's smaller).
 */
export function findFreeGapForNewZone(zones: SpeedZone[]): { fromT: number; toT: number } | null {
  const sorted = [...zones].sort((a, b) => a.fromT - b.fromT);

  let bestGap: { fromT: number; toT: number } | null = null;
  let bestWidth = 0;
  let cursor = 0;

  for (const zone of sorted) {
    const gapWidth = zone.fromT - cursor;

    if (gapWidth > bestWidth) {
      bestWidth = gapWidth;
      bestGap = { fromT: cursor, toT: zone.fromT };
    }

    cursor = Math.max(cursor, zone.toT);
  }

  const tailWidth = 1 - cursor;

  if (tailWidth > bestWidth) {
    bestWidth = tailWidth;
    bestGap = { fromT: cursor, toT: 1 };
  }

  if (!bestGap || bestWidth < MIN_GAP) {
    return null;
  }

  const width = Math.min(DEFAULT_ZONE_WIDTH, bestWidth);

  return { fromT: bestGap.fromT, toT: bestGap.fromT + width };
}
