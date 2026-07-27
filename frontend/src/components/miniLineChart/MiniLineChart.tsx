import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { toolTipStyle } from "./toolTipStyle";

export interface ChartPoint {
  x: number;
  y: number;
}

export interface ReferenceLineSpec {
  x: number;
  color: string;
  dashed?: boolean;
}

export interface ChartTooltipConfig {
  formatValue: (value: number) => string;
  valueLabel: string;
  formatLabel: (label: number) => string;
}

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface MiniLineChartProps {
  data: ChartPoint[];
  height?: number;
  lineColor?: string;
  showAxes?: boolean;
  showGrid?: boolean;
  xLabel?: string;
  yLabel?: string;
  referenceLines?: ReferenceLineSpec[];
  tooltip?: ChartTooltipConfig;
  margin?: ChartMargin;
  yAxisWidth?: number;
  animate?: boolean;
}

const DEFAULT_MARGIN: ChartMargin = { top: 4, right: 4, bottom: 4, left: 4 };
const AXIS_TICK_FONT_SIZE = 8;
const AXIS_LABEL_FONT_SIZE = 8;
const X_LABEL_OFFSET = -8;
const Y_LABEL_OFFSET = 8;
const REFERENCE_LINE_WIDTH = 1;
const CHART_LINE_WIDTH = 1.5;

export function MiniLineChart({
  data,
  height = 105,
  lineColor = "var(--chart-line)",
  showAxes = false,
  showGrid = false,
  xLabel,
  yLabel,
  referenceLines = [],
  tooltip,
  margin = DEFAULT_MARGIN,
  yAxisWidth = 26,
  animate = true,
}: MiniLineChartProps) {
  const tooltipFormatter = tooltip
    ? (value: unknown): [string, string] => [tooltip.formatValue(Number(value)), tooltip.valueLabel]
    : undefined;
  const tooltipLabelFormatter = tooltip
    ? (label: unknown): string => tooltip.formatLabel(Number(label))
    : undefined;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={margin}>
        {showGrid && <CartesianGrid strokeDasharray="2 2" stroke="var(--border)" />}

        {showAxes && (
          <XAxis
            dataKey="x"
            type="number"
            tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: "var(--text-4)" }}
            tickLine={false}
            label={
              xLabel
                ? {
                    value: xLabel,
                    position: "insideBottom",
                    offset: X_LABEL_OFFSET,
                    fontSize: AXIS_LABEL_FONT_SIZE,
                    fill: "var(--text-3)",
                  }
                : undefined
            }
          />
        )}
        {showAxes && (
          <YAxis
            dataKey="y"
            tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: "var(--text-4)" }}
            tickLine={false}
            width={yAxisWidth}
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: -90,
                    position: "top",
                    offset: Y_LABEL_OFFSET,
                    fontSize: AXIS_LABEL_FONT_SIZE,
                    fill: "var(--text-3)",
                  }
                : undefined
            }
          />
        )}

        {tooltip && (
          <Tooltip
            contentStyle={toolTipStyle}
            formatter={tooltipFormatter}
            labelFormatter={tooltipLabelFormatter}
          />
        )}

        {referenceLines.map((ref, i) => (
          <ReferenceLine
            key={i}
            x={ref.x}
            stroke={ref.color}
            strokeDasharray={ref.dashed === false ? undefined : "3 3"}
            strokeWidth={REFERENCE_LINE_WIDTH}
          />
        ))}

        <Line
          type="monotone"
          dataKey="y"
          stroke={lineColor}
          strokeWidth={CHART_LINE_WIDTH}
          dot={false}
          isAnimationActive={animate}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
