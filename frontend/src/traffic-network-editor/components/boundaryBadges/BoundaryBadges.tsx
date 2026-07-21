import type { BoundaryNode, RoadNode } from "../../../entities/network";
import { type Camera, worldToScreen } from "../../model/camera";
import { BADGE_PLATE_RADIUS, COLORS, NODE_RADIUS, ROAD_LABEL_MIN_ZOOM } from "../../pixi/constants";
import { NodeBadge } from "../nodeBadge/NodeBadge";

export function BoundaryBadges({
  nodes,
  boundaryNodes,
  camera,
}: {
  nodes: RoadNode[];
  boundaryNodes: Record<string, BoundaryNode>;
  camera: Camera;
}) {
  if (camera.zoom <= ROAD_LABEL_MIN_ZOOM) {
    return null;
  }

  return (
    <>
      {nodes.map((node) => {
        const boundary = boundaryNodes[node.id];

        if (!boundary) {
          return null;
        }

        const p = worldToScreen(node.position.x, node.position.y, camera);
        const badgeY = p.y - NODE_RADIUS - BADGE_PLATE_RADIUS - 4;
        const isSource = boundary.role.kind === "source";

        return (
          <NodeBadge
            key={node.id}
            x={p.x}
            y={badgeY}
            label={isSource ? "S" : "K"}
            plateColor={isSource ? COLORS.sourceBadgePlate : COLORS.sinkBadgePlate}
          />
        );
      })}
    </>
  );
}
