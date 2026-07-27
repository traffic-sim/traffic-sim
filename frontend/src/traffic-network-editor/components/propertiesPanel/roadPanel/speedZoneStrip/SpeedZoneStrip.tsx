import type { SpeedZone } from "../../../../../entities/network";

import "./SpeedZoneStrip.css";

interface SpeedZoneStripProps {
  speedZones: SpeedZone[];
  vFree: number;
  onSelect: (index: number) => void;
}

export function SpeedZoneStrip({ speedZones, vFree, onSelect }: SpeedZoneStripProps) {
  return (
    <div className="speed-zone-strip">
      {speedZones.map((z, i) => {
        const hue = Math.round((z.limit / vFree) * 120);

        return (
          <div
            key={i}
            className="speed-zone-strip__zone"
            title={`Zone ${i + 1}: ${z.limit.toFixed(0)} km/h`}
            style={{
              left: `${z.fromT * 100}%`,
              width: `${(z.toT - z.fromT) * 100}%`,
              background: `hsla(${hue}, 60%, 40%, 0.3)`,
              borderLeft: `0.125rem solid hsl(${hue}, 60%, 40%)`,
              borderRight: `0.125rem solid hsl(${hue}, 60%, 40%)`,
            }}
            onClick={() => onSelect(i)}
          />
        );
      })}
    </div>
  );
}
