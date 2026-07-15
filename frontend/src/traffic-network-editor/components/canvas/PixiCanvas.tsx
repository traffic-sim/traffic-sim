import { Application, extend } from "@pixi/react";
import { Container, Graphics, Rectangle } from "pixi.js";
import { useCallback, useMemo, useRef } from "react";

import { useNetworkStore } from "../../../entities/network";
import { COLORS } from "../../pixi/constants";
import { drawGrid } from "../../pixi/renderGrid";
import { drawNetwork } from "../../pixi/renderNetwork";
import { drawSnapIndicator } from "../../pixi/renderSnapIndicator";
import { useEditorUiStore } from "../../store/editorUiStore";

import { useCanvasPan } from "./useCanvasPan";
import { useCanvasZoom } from "./useCanvasZoom";
import { useContainerSize } from "./useContainerSize";

import "./PixiCanvas.css";

extend({ Container, Graphics });

export function PixiCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);

  const camera = useEditorUiStore((s) => s.camera);
  const snapPreview = useEditorUiStore((s) => s.snapPreview);
  const selectedNodeId = useEditorUiStore((s) => s.selectedNodeId);
  const selectedEdgeId = useEditorUiStore((s) => s.selectedEdgeId);
  const nodes = useNetworkStore((s) => s.nodes);
  const edges = useNetworkStore((s) => s.edges);

  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerUpOutside,
    handlePointerLeave,
  } = useCanvasPan();

  const handleWheel = useCanvasZoom();

  const handleDrawGrid = useCallback(
    (graphics: Graphics) => drawGrid(graphics, size.width, size.height, camera),
    [size.width, size.height, camera]
  );

  const handleDrawNetwork = useCallback(
    (graphics: Graphics) =>
      drawNetwork({ graphics, nodes, edges, selectedNodeId, selectedEdgeId, camera }),
    [nodes, edges, selectedNodeId, selectedEdgeId, camera]
  );

  const handleDrawSnap = useCallback(
    (graphics: Graphics) => drawSnapIndicator(graphics, snapPreview, camera),
    [snapPreview, camera]
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
        <pixiContainer
          eventMode="static"
          hitArea={hitArea}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerUpOutside={handlePointerUpOutside}
          onPointerLeave={handlePointerLeave}
          onWheel={handleWheel}
        >
          <pixiGraphics draw={handleDrawGrid} />
          <pixiGraphics draw={handleDrawNetwork} />
          <pixiGraphics draw={handleDrawSnap} />
        </pixiContainer>
      </Application>
    </div>
  );
}
