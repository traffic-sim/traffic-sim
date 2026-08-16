export { useNetworkStore } from "./model/networkStore";

export type {
  NetworkGraph,
  RoadNode,
  RoadEdge,
  SpeedZone,
  Intersection,
  BoundaryNode,
  BoundaryRole,
  SourceRole,
  SinkRole,
  TrafficScenario,
  ScenarioType,
} from "./model/types";

export { getIntersectionKind } from "./model/intersection";
export type { IntersectionArm, ArmDirection, IntersectionKind } from "./model/intersection";

export {
  DEFAULT_SCENARIO,
  DEFAULT_SINK_CAPACITY,
  DEFAULT_EDGE_PROPERTIES,
} from "./model/constants";
export {
  V_FREE_RANGE,
  RHO_CRITICAL_RANGE,
  RHO_JAM_RANGE,
  CELL_COUNT_RANGE,
  SPEED_ZONE_LIMIT_MIN,
  SPEED_ZONE_LIMIT_STEP,
  BASE_INFLOW_RANGE,
  AMPLITUDE_RANGE,
  PERIOD_RANGE,
  SINK_CAPACITY_RANGE,
} from "./model/constants";

export { SCENARIO_LABELS, computeScenarioInflow } from "./model/scenario";

export { niceYMax } from "./model/chartScale";

export {
  triangularFlow,
  congestionWaveSpeed,
  capacityFlow,
  sampleFundamentalDiagram,
} from "./model/fundamentalDiagram";
export type { TriangularFdParams } from "./model/fundamentalDiagram";

export { generateNextRoadName } from "./model/roadNaming";

export {
  getZoneDragBounds,
  clampZoneFromT,
  clampZoneToT,
  findFreeGapForNewZone,
} from "./model/speedZoneLayout";
