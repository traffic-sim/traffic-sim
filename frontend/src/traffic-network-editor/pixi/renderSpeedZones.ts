import type { Graphics } from "pixi.js";

import type { RoadEdge, RoadNode } from "../../entities/network";
import { type Camera, worldToScreen } from "../model/camera";

import { NODE_RADIUS, SPEED_ZONE_OVERLAY_WIDTH } from "./constants";

interface RenderSpeedZonesParams {
  graphics: Graphics;
  nodes: Record<string, RoadNode>;
  edges: Record<string, RoadEdge>;
  camera: Camera;
}

export function renderSpeedZones({ graphics, nodes, edges, camera }: RenderSpeedZonesParams) {
  graphics.clear();

  for (const edge of Object.values(edges)) {
    if (edge.speedZones.length === 0) {
      continue;
    }

    const from = nodes[edge.from];
    const to = nodes[edge.to];

    if (!from || !to) {
      continue;
    }

    const screenFromNode = worldToScreen(from.position.x, from.position.y, camera);
    const screenToNode = worldToScreen(to.position.x, to.position.y, camera);

    const dx = screenToNode.x - screenFromNode.x;
    const dy = screenToNode.y - screenFromNode.y;
    const totalLen = Math.hypot(dx, dy);

    // Road too short (at this zoom) to fit anything between both nodes'
    if (totalLen <= NODE_RADIUS * 2) {
      continue;
    }

    const ux = dx / totalLen;
    const uy = dy / totalLen;
    const minDist = NODE_RADIUS;
    const maxDist = totalLen - NODE_RADIUS;

    for (const zone of edge.speedZones) {
      const rawStartDist = zone.fromT * totalLen;
      const rawEndDist = zone.toT * totalLen;

      const startDist = Math.min(Math.max(rawStartDist, minDist), maxDist);
      const endDist = Math.min(Math.max(rawEndDist, minDist), maxDist);

      if (endDist <= startDist) {
        continue;
      }

      const startX = screenFromNode.x + ux * startDist;
      const startY = screenFromNode.y + uy * startDist;
      const endX = screenFromNode.x + ux * endDist;
      const endY = screenFromNode.y + uy * endDist;

      const hue = Math.round((zone.limit / edge.vFree) * 120);

      graphics
        .moveTo(startX, startY)
        .lineTo(endX, endY)
        .stroke({ width: SPEED_ZONE_OVERLAY_WIDTH, color: `hsl(${hue}, 60%, 40%)`, cap: "butt" });
    }
  }
}
