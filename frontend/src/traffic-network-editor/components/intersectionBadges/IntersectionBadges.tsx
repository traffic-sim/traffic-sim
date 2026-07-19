import type { Graphics } from "pixi.js";
import { useCallback } from "react";

import type { Intersection, RoadEdge, RoadNode } from "../../../entities/network";
import {
  buildArmsIndex,
  getIntersectionKind,
  IntersectionKind,
} from "../../../entities/network/model/intersection";
import { type Camera, worldToScreen } from "../../model/camera";
import {
  COLORS,
  INTERSECTION_BADGE_PLATE_RADIUS,
  NODE_RADIUS,
  ROAD_LABEL_MIN_ZOOM,
} from "../../pixi/constants";

import { TextStyle } from "./textStyle";

const KIND_LABEL: Record<IntersectionKind, string> = {
  [IntersectionKind.Chain]: "",
  [IntersectionKind.Junction]: "J",
  [IntersectionKind.Merge]: "M",
  [IntersectionKind.Diverge]: "D",
};

export function IntersectionBadges({
  nodes,
  edges,
  intersections,
  camera,
}: {
  nodes: RoadNode[];
  edges: RoadEdge[];
  intersections: Record<string, Intersection>;
  camera: Camera;
}) {
  if (camera.zoom <= ROAD_LABEL_MIN_ZOOM) {
    return null;
  }

  const armsIndex = buildArmsIndex(edges);

  return (
    <>
      {nodes.map((node) => {
        if (!(node.id in intersections)) {
          return null;
        }

        const kind = getIntersectionKind(armsIndex.get(node.id) ?? []);

        if (kind === IntersectionKind.Chain) {
          return null;
        }

        const p = worldToScreen(node.position.x, node.position.y, camera);
        const badgeY = p.y - NODE_RADIUS - INTERSECTION_BADGE_PLATE_RADIUS - 4;

        return <IntersectionBadge key={node.id} x={p.x} y={badgeY} label={KIND_LABEL[kind]} />;
      })}
    </>
  );
}

function IntersectionBadge({ x, y, label }: { x: number; y: number; label: string }) {
  const drawPlate = useCallback(
    (g: Graphics) => {
      g.clear();
      g.circle(x, y, INTERSECTION_BADGE_PLATE_RADIUS).fill(COLORS.intersectionBadgePlate);
    },
    [x, y]
  );

  return (
    <>
      <pixiGraphics draw={drawPlate} />
      <pixiText text={label} x={x} y={y} anchor={0.5} style={TextStyle} />
    </>
  );
}
