import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Application, extend } from "@pixi/react";
import { Container, Graphics, Rectangle, type FederatedPointerEvent } from "pixi.js";
import { useNetworkStore } from "../store/networkStore.ts";
import { drawNetwork } from "../pixi/renderNetwork.ts";
import { drawGrid } from "../pixi/renderGrid.ts";
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from "../pixi/constants.ts";
import "./PixiCanvas.css";

extend({ Container, Graphics });

export function PixiCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const nodes = useNetworkStore((s) => s.nodes);
  const edges = useNetworkStore((s) => s.edges);
  const selectedNodeId = useNetworkStore((s) => s.selectedNodeId);
  const handleCanvasTap = useNetworkStore((s) => s.handleCanvasTap);

  const handlePointerTap = useCallback(
    (event: FederatedPointerEvent) => handleCanvasTap(event.global.x, event.global.y),
    [handleCanvasTap]
  );

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
