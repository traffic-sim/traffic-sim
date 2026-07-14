import "./PixiCanvas.css";
import { Application, extend } from "@pixi/react";
import { Container, Graphics, Rectangle } from "pixi.js";
import { useCallback, useMemo, useRef } from "react";
import { useNetworkStore } from "../../../entities/network";
import { COLORS } from "../../pixi/constants.ts";
import { drawGrid } from "../../pixi/renderGrid.ts";
import { drawNetwork } from "../../pixi/renderNetwork.ts";
import { useEditorUiStore } from "../../store/editorUiStore.ts";
import { useCanvasTap } from "./useCanvasTap.ts";
import { useContainerSize } from "./useContainerSize.ts";

extend({ Container, Graphics });

export function PixiCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);

  const selectedNodeId = useEditorUiStore((s) => s.selectedNodeId);
  const nodes = useNetworkStore((s) => s.nodes);
  const edges = useNetworkStore((s) => s.edges);

  const handlePointerTap = useCanvasTap();

  const handleDrawGrid = useCallback(
    (graphics: Graphics) => drawGrid(graphics, size.width, size.height),
    [size.width, size.height]
  );

  const handleDrawNetwork = useCallback(
    (graphics: Graphics) => drawNetwork({ graphics, nodes, edges, selectedNodeId }),
    [nodes, edges, selectedNodeId]
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
      >
        <pixiContainer eventMode="static" hitArea={hitArea} onPointerTap={handlePointerTap}>
          <pixiGraphics draw={handleDrawGrid} />
          <pixiGraphics draw={handleDrawNetwork} />
        </pixiContainer>
      </Application>
    </div>
  );
}
