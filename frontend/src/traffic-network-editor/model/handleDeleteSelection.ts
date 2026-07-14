export interface DeleteSelectionDeps {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  clearSelection: () => void;
}

export function handleDeleteSelection(deps: DeleteSelectionDeps) {
  const { selectedNodeId, selectedEdgeId, removeNode, removeEdge, clearSelection } = deps;

  if (selectedNodeId) {
    removeNode(selectedNodeId);
    clearSelection();
  } else if (selectedEdgeId) {
    removeEdge(selectedEdgeId);
    clearSelection();
  }
}
