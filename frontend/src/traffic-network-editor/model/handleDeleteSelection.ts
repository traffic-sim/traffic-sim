export interface DeleteSelectionState {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
}

export interface DeleteSelectionActions {
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  clearSelection: () => void;
}

export function handleDeleteSelection(
  state: DeleteSelectionState,
  actions: DeleteSelectionActions
) {
  const { selectedNodeId, selectedEdgeId } = state;
  const { removeNode, removeEdge, clearSelection } = actions;

  if (selectedNodeId) {
    removeNode(selectedNodeId);
    clearSelection();
  } else if (selectedEdgeId) {
    removeEdge(selectedEdgeId);
    clearSelection();
  }
}
