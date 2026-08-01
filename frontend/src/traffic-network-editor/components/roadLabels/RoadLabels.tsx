import type { RoadEdge, RoadNode } from "../../../entities/network";
import { type Camera, worldToScreen } from "../../model/camera";
import { LABEL_MIN_ZOOM, ROAD_LABEL_OFFSET } from "../../pixi/constants";

import { TextStyle } from "./textStyle";

export function RoadLabels({
  nodes,
  edges,
  camera,
}: {
  nodes: Record<string, RoadNode>;
  edges: Record<string, RoadEdge>;
  camera: Camera;
}) {
  if (camera.zoom <= LABEL_MIN_ZOOM) {
    return null;
  }

  return (
    <>
      {Object.values(edges).map((edge) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];

        if (!from || !to) {
          return null;
        }

        const fromScreen = worldToScreen(from.position.x, from.position.y, camera);
        const toScreen = worldToScreen(to.position.x, to.position.y, camera);

        return (
          <pixiText
            key={edge.id}
            text={edge.name}
            x={(fromScreen.x + toScreen.x) / 2}
            y={(fromScreen.y + toScreen.y) / 2 - ROAD_LABEL_OFFSET}
            anchor={0.5}
            style={TextStyle}
          />
        );
      })}
    </>
  );
}
