import { useNetworkStore } from "../../../entities/network";
import { useEditorUiStore } from "../../store/editorUiStore";

import { BoundaryNodePanel } from "./boundaryNodePanel";
import { RoadPanel } from "./roadPanel";

import "./PropertiesPanel.css";

export function PropertiesPanel() {
  const selectedNodeId = useEditorUiStore((s) => s.selectedNodeId);
  const selectedEdgeId = useEditorUiStore((s) => s.selectedEdgeId);
  const edges = useNetworkStore((s) => s.edges);
  const boundaryNodes = useNetworkStore((s) => s.boundaryNodes);
  const intersection = useNetworkStore((s) => s.intersections);

  if (selectedEdgeId && Object.hasOwn(edges, selectedEdgeId)) {
    return (
      <div className="properties-panel">
        <RoadPanel edge={edges[selectedEdgeId]} />
      </div>
    );
  }

  if (selectedNodeId && Object.hasOwn(boundaryNodes, selectedNodeId)) {
    return (
      <div className="properties-panel">
        <BoundaryNodePanel node={boundaryNodes[selectedNodeId]} />
      </div>
    );
  }

  if (selectedNodeId && Object.hasOwn(intersection, selectedNodeId)) {
    // IntersectionPanel lands in a later
    return (
      <div className="properties-panel">
        <div className="panel-titlebar">
          <span className="panel-title">Intersection</span>
        </div>
        <div className="properties-panel__empty">Intersection panel not built yet</div>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <div className="panel-titlebar">
        <span className="panel-title">Properties</span>
      </div>
      <div className="properties-panel__empty">
        Select a road or node to inspect
        <br />
        and configure parameters
      </div>
    </div>
  );
}
