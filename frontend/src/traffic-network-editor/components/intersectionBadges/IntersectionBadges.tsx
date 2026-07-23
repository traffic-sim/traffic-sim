import type { RoadNode } from "../../../entities/network";
import { getIntersectionKind } from "../../../entities/network";
import type { GraphIndex } from "../../../entities/network/model/graphIndex";
import { type Camera, worldToScreen } from "../../model/camera";
import { COLORS, LABEL_MIN_ZOOM } from "../../pixi/constants";
import { calculateBadgeY } from "../nodeBadge/calculateBadgeY";
import { NodeBadge } from "../nodeBadge/NodeBadge";

const KIND_LABEL = { junction: "J", merge: "M", diverge: "D" } as const;

export function IntersectionBadges({
  nodes,
  graphIndex,
  camera,
}: {
  nodes: Record<string, RoadNode>;
  graphIndex: GraphIndex;
  camera: Camera;
}) {
  if (camera.zoom <= LABEL_MIN_ZOOM) {
    return null;
  }

  return (
    <>
      {Object.keys(graphIndex.armsIndex).map((nodeId) => {
        const node = nodes[nodeId];

        const kind = getIntersectionKind(graphIndex, nodeId);

        if (kind === "chain") {
          return null;
        }

        const p = worldToScreen(node.position.x, node.position.y, camera);

        return (
          <NodeBadge
            key={nodeId}
            x={p.x}
            y={calculateBadgeY(p.y)}
            label={KIND_LABEL[kind]}
            plateColor={COLORS.intersectionBadgePlate}
          />
        );
      })}
    </>
  );
}
