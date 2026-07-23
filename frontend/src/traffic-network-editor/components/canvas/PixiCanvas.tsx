import { Application, extend } from "@pixi/react";
import type { FederatedPointerEvent } from "pixi.js";
import { Container, Graphics, Rectangle, Text } from "pixi.js";
import { useCallback, useMemo, useRef } from "react";

import { useNetworkStore } from "../../../entities/network";
import { worldToScreen } from "../../model/camera";
import { EditorTool } from "../../model/EditorTool";
import { COLORS } from "../../pixi/constants";
import { renderPreviewLine } from "../../pixi/renderDrawPreview";
import { renderGrid } from "../../pixi/renderGrid";
import { drawNetwork } from "../../pixi/renderNetwork";
import { drawSnapIndicator } from "../../pixi/renderSnapIndicator";
import { useEditorUiStore } from "../../store/editorUiStore";
import { BoundaryBadges } from "../boundaryBadges/BoundaryBadges";
import { DrawHint } from "../drawHint/DrawHint";
import { IntersectionBadges } from "../intersectionBadges/IntersectionBadges";
import { RoadLabels } from "../roadLabels/RoadLabels";
import { ScaleBar } from "../scaleBar/ScaleBar";

import { useCanvasPan } from "./useCanvasPan";
import { useCanvasSnapPreview } from "./useCanvasSnapPreview";
import { useCanvasTap } from "./useCanvasTap";
import { useCanvasZoom } from "./useCanvasZoom";
import { useContainerSize } from "./useContainerSize";

import "./PixiCanvas.css";

extend({ Container, Graphics, Text });

export function PixiCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);

  const camera = useEditorUiStore((s) => s.camera);
  const tool = useEditorUiStore((s) => s.tool);
  const snapPreview = useEditorUiStore((s) => s.snapPreview);
  const selectedNodeId = useEditorUiStore((s) => s.selectedNodeId);
  const selectedEdgeId = useEditorUiStore((s) => s.selectedEdgeId);

  const nodes = useNetworkStore((s) => s.nodes);
  const edges = useNetworkStore((s) => s.edges);
  const intersections = useNetworkStore((s) => s.intersections);
  const boundaryNodes = useNetworkStore((s) => s.boundaryNodes);
  const graphIndex = useNetworkStore((s) => s.graphIndex);

  const startNode =
    tool === EditorTool.Draw && selectedNodeId ? (nodes[selectedNodeId] ?? null) : null;

  const hintPos = snapPreview ? worldToScreen(snapPreview.x, snapPreview.y, camera) : null;

  const { handlePointerDown, handlePointerMove, endDrag } = useCanvasPan();
  const handleSnapPreview = useCanvasSnapPreview();
  const handleTap = useCanvasTap();
  const handleWheel = useCanvasZoom();

  const handlePointerUp = useCallback(
    (event: FederatedPointerEvent) => {
      if (endDrag(event, true)) {
        handleTap(event);
      }
    },
    [endDrag, handleTap]
  );

  const handlePointerUpOutside = useCallback(
    (event: FederatedPointerEvent) => {
      endDrag(event, false);
    },
    [endDrag]
  );

  const handlePointerLeave = useCallback(() => {
    useEditorUiStore.getState().setSnapPreview(null);
  }, []);

  const handleDrawGrid = useCallback(
    (graphics: Graphics) => renderGrid(graphics, size.width, size.height, camera),
    [size.width, size.height, camera]
  );

  const handleDrawNetwork = useCallback(
    (graphics: Graphics) =>
      drawNetwork({
        graphics,
        nodes,
        edges,
        intersections,
        selectedNodeId,
        selectedEdgeId,
        camera,
      }),
    [nodes, edges, intersections, selectedNodeId, selectedEdgeId, camera]
  );

  const handleDrawSnap = useCallback(
    (graphics: Graphics) => drawSnapIndicator(graphics, snapPreview, camera),
    [snapPreview, camera]
  );

  const handleDrawPreview = useCallback(
    (graphics: Graphics) =>
      renderPreviewLine(graphics, startNode?.position ?? null, snapPreview, camera),
    [startNode, snapPreview, camera]
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
          onPointerMove={(e: FederatedPointerEvent) => {
            handlePointerMove(e);
            handleSnapPreview(e);
          }}
          onPointerUp={handlePointerUp}
          onPointerUpOutside={handlePointerUpOutside}
          onPointerLeave={handlePointerLeave}
          onWheel={handleWheel}
        >
          <pixiGraphics draw={handleDrawGrid} />
          <pixiGraphics draw={handleDrawNetwork} />
          <RoadLabels nodes={nodes} edges={edges} camera={camera} />
          <IntersectionBadges nodes={nodes} graphIndex={graphIndex} camera={camera} />
          <BoundaryBadges nodes={nodes} boundaryNodes={boundaryNodes} camera={camera} />
          <pixiGraphics draw={handleDrawSnap} />
          {tool === EditorTool.Draw && <pixiGraphics draw={handleDrawPreview} />}
        </pixiContainer>
        <ScaleBar width={size.width} height={size.height} zoom={camera.zoom} />
        {tool === EditorTool.Draw && startNode && snapPreview && hintPos && (
          <DrawHint position={hintPos} hasStart />
        )}
      </Application>
    </div>
  );
}
