import type { BoundaryNode, RoadNode } from "../../../entities/network";
import { type Camera, worldToScreen } from "../../model/camera";
import { COLORS, LABEL_MIN_ZOOM } from "../../pixi/constants";
import { calculateBadgeY } from "../nodeBadge/calculateBadgeY";
import { NodeBadge } from "../nodeBadge/NodeBadge";

export function BoundaryBadges({
  nodes,
  boundaryNodes,
  camera,
}: {
  nodes: Record<string, RoadNode>;
  boundaryNodes: Record<string, BoundaryNode>;
  camera: Camera;
}) {
  if (camera.zoom <= LABEL_MIN_ZOOM) {
    return null;
  }

  return (
    <>
      {Object.values(nodes).map((node) => {
        const boundary = boundaryNodes[node.id];

        if (!boundary) {
          return null;
        }

        const p = worldToScreen(node.position.x, node.position.y, camera);
        const isSource = boundary.role.kind === "source";

        return (
          <NodeBadge
            key={node.id}
            x={p.x}
            y={calculateBadgeY(p.y)}
            label={isSource ? "S" : "K"}
            plateColor={isSource ? COLORS.sourceBadgePlate : COLORS.sinkBadgePlate}
          />
        );
      })}
    </>
  );
}
