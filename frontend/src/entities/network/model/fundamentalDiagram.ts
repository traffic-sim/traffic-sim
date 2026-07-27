export interface TriangularFdParams {
  vFree: number; // km/h
  rhoCritical: number; // veh/km
  rhoJam: number; // veh/km
}

/*
 * Congestion-wave slope magnitude - the downward (congested) branch of the triangular FD.
 */
export function congestionWaveSpeed({ vFree, rhoCritical, rhoJam }: TriangularFdParams): number {
  const freeFlowBranchRange = rhoJam - rhoCritical;

  if (freeFlowBranchRange <= 0) {
    return 0;
  }

  return (vFree * rhoCritical) / freeFlowBranchRange;
}

/* Capacity - the maximum flow, occurring exactly at rhoCritical. */
export function capacityFlow(params: TriangularFdParams): number {
  return params.vFree * params.rhoCritical;
}

/*
 * Triangular FD: q(ρ) = min(vFree·ρ, w·(rhoJam − ρ)), clamped to [0, rhoJam].
 * Below rhoCritical: free-flow branch, q = vFree·ρ.
 * Above rhoCritical: congested branch, q = w·(rhoJam − ρ).
 */
export function triangularFlow(rho: number, params: TriangularFdParams): number {
  const { vFree, rhoCritical, rhoJam } = params;

  if (rho <= 0 || rho >= rhoJam) {
    return 0;
  }

  if (rho <= rhoCritical) {
    return vFree * rho;
  }

  const w = congestionWaveSpeed(params);

  return w * (rhoJam - rho);
}

export function sampleFundamentalDiagram(
  params: TriangularFdParams,
  steps = 60
): { rho: number; q: number }[] {
  const points: { rho: number; q: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const rho = (params.rhoJam * i) / steps;
    points.push({ rho, q: triangularFlow(rho, params) });
  }

  return points;
}
