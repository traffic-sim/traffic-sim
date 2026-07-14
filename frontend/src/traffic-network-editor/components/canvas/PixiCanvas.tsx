import { Application, extend } from "@pixi/react";
import { Container, Graphics, Rectangle } from "pixi.js";
import { useCallback, useMemo, useRef, useState } from "react";

import { useNetworkStore } from "../../../entities/network";
import { DEFAULT_CAMERA } from "../../model/camera";
import { COLORS } from "../../pixi/constants";
import { drawGrid } from "../../pixi/renderGrid";
import { drawNetwork } from "../../pixi/renderNetwork";
import { useEditorUiStore } from "../../store/editorUiStore";

import { useCanvasTap } from "./useCanvasTap";
import { useContainerSize } from "./useContainerSize";

import "./PixiCanvas.css";

extend({ Container, Graphics });

export function PixiCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const [camera] = useState(DEFAULT_CAMERA);

  const selectedNodeId = useEditorUiStore((s) => s.selectedNodeId);
  const selectedEdgeId = useEditorUiStore((s) => s.selectedEdgeId);
  const nodes = useNetworkStore((s) => s.nodes);
  const edges = useNetworkStore((s) => s.edges);

  const handlePointerTap = useCanvasTap(camera);

  const handleDrawGrid = useCallback(
    (graphics: Graphics) => drawGrid(graphics, size.width, size.height, camera),
    [size.width, size.height, camera]
  );

  const handleDrawNetwork = useCallback(
    (graphics: Graphics) =>
      drawNetwork({ graphics, nodes, edges, selectedNodeId, selectedEdgeId, camera }),
    [nodes, edges, selectedNodeId, selectedEdgeId, camera]
  );

  const hitArea = useMemo(
    () => new Rectangle(0, 0, size.width, size.height),
    [size.width, size.height]
  );

  return (
    <div className="pixi-canvas" ref={containerRef}>
      <Application
        resizeTo={containerRef}
        resolution={window.devicePixelRatio || 1}
        autoDensity
        background={COLORS.background}
        antialias
      >
        <pixiContainer eventMode="static" hitArea={hitArea} onPointerTap={handlePointerTap}>
          <pixiGraphics draw={handleDrawGrid} />
          <pixiGraphics draw={handleDrawNetwork} />
        </pixiContainer>
      </Application>
    </div>
  );
}
