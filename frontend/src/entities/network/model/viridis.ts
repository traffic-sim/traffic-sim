const VIRIDIS_STOPS: [number, number, number][] = [
  [68, 1, 84],
  [72, 35, 116],
  [64, 67, 135],
  [52, 94, 141],
  [41, 120, 142],
  [32, 144, 140],
  [34, 167, 132],
  [68, 190, 112],
  [121, 209, 81],
  [189, 222, 38],
  [253, 231, 37],
];

function viridisRgb(t: number): [number, number, number] {
  const c = Math.max(0, Math.min(1, t));
  const idx = c * (VIRIDIS_STOPS.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(VIRIDIS_STOPS.length - 1, lo + 1);
  const f = idx - lo;

  return [
    Math.round(VIRIDIS_STOPS[lo][0] + f * (VIRIDIS_STOPS[hi][0] - VIRIDIS_STOPS[lo][0])),
    Math.round(VIRIDIS_STOPS[lo][1] + f * (VIRIDIS_STOPS[hi][1] - VIRIDIS_STOPS[lo][1])),
    Math.round(VIRIDIS_STOPS[lo][2] + f * (VIRIDIS_STOPS[hi][2] - VIRIDIS_STOPS[lo][2])),
  ];
}

export function densityColorHex(ratio: number): string {
  const [r, g, b] = viridisRgb(ratio);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function densityGradient(density: number[], maxDensity: number): string {
  if (!density.length) {
    return "#e8e8e0";
  }

  const n = Math.min(density.length, 80);
  const stops = Array.from({ length: n }, (_, i) => {
    const idx = Math.floor((i * density.length) / n);

    return `${densityColorHex(density[idx] / maxDensity)} ${((i / (n - 1)) * 100).toFixed(1)}%`;
  });

  return `linear-gradient(to right, ${stops.join(",")})`;
}
