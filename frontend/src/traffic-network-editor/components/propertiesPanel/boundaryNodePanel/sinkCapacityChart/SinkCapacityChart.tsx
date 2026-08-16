import { MiniLineChart } from "../../../../../components";
import { niceYMax } from "../../../../../entities/network";

export function SinkCapacityChart({ capacity }: { capacity: number }) {
  const domainMax = niceYMax(capacity);
  const data = [
    { x: 0, y: capacity },
    { x: 1, y: capacity },
  ];

  return (
    <MiniLineChart
      data={data}
      caption={`Capacity ceiling: ${capacity} veh`}
      showXAxis={false}
      yDomain={[0, domainMax]}
      tooltip={{
        formatValue: (value) => `${value.toFixed(0)} veh`,
        valueLabel: "capacity",
        formatLabel: () => "",
      }}
    />
  );
}
