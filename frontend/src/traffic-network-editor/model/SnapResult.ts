export enum SnapType {
  Endpoint,
  Grid,
  None,
}

export interface SnapResult {
  x: number;
  y: number;
  type: SnapType;
  nodeId: string | null;
}
