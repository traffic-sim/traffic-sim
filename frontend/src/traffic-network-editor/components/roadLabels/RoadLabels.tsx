import { extend } from "@pixi/react";
import { Text } from "pixi.js";

import type { RoadEdge, RoadNode } from "../../../entities/network";
import { type Camera, worldToScreen } from "../../model/camera";
import { ROAD_LABEL_MIN_ZOOM, ROAD_LABEL_OFFSET } from "../../pixi/constants";

import { TextStyle } from "./textStyle";

extend({ Text });

export function RoadLabels({
  nodes,
  edges,
  camera,
}: {
  nodes: RoadNode[];
  edges: RoadEdge[];
  camera: Camera;
}) {
  if (camera.zoom <= ROAD_LABEL_MIN_ZOOM) {
    return null;
  }

  return (
    <>
      {edges.map((edge) => {
        const from = nodes.find((n) => n.id === edge.from);
        const to = nodes.find((n) => n.id === edge.to);

        if (!from || !to) {
          return null;
        }

        const fromScreen = worldToScreen(from.position.x, from.position.y, camera);
        const toScreen = worldToScreen(to.position.x, to.position.y, camera);

        return (
          <pixiText
            key={edge.id}
            text={edge.id}
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
