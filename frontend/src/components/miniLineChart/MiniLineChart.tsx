import { useEffect, useState } from "react";
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

import "./MiniLineChart.css";

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
  caption?: string;
  height?: number;
  lineColor?: string;
  curveType?: "monotone" | "linear";
  showAxes?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGrid?: boolean;
  xLabel?: string;
  yLabel?: string;
  referenceLines?: ReferenceLineSpec[];
  tooltip?: ChartTooltipConfig;
  margin?: ChartMargin;
  yAxisWidth?: number;
  /** Whether this chart instance should play its entrance (draw-in) animation
   * at all. When true, the animation plays exactly once, right after this
   * component mounts. */
  animate?: boolean;
  animationDuration?: number;
  yDomain?: [number | string, number | string];
  xTicks?: number[];
  framed?: boolean;
}

const DEFAULT_MARGIN: ChartMargin = { top: 12, right: 16, bottom: 16, left: 20 };
const AXIS_TICK_FONT_SIZE = 8;
const AXIS_LABEL_FONT_SIZE = 8;
const X_LABEL_OFFSET = -8;
const Y_LABEL_OFFSET = 8;
const REFERENCE_LINE_WIDTH = 1;
const CHART_LINE_WIDTH = 1.5;

export function MiniLineChart({
  data,
  caption,
  height = 150,
  lineColor = "var(--chart-line)",
  curveType = "linear",
  showAxes = true,
  showXAxis = showAxes,
  showYAxis = showAxes,
  showGrid = true,
  xLabel,
  yLabel,
  referenceLines = [],
  tooltip,
  margin = DEFAULT_MARGIN,
  yAxisWidth = 26,
  animate = true,
  animationDuration = 600,
  yDomain = ["auto", "auto"],
  xTicks,
  framed = true,
}: MiniLineChartProps) {
  const hasCustomYDomain = yDomain[0] !== "auto" || yDomain[1] !== "auto";
  const tooltipFormatter = tooltip
    ? (value: unknown): [string, string] => [tooltip.formatValue(Number(value)), tooltip.valueLabel]
    : undefined;
  const tooltipLabelFormatter = tooltip
    ? (label: unknown): string => tooltip.formatLabel(Number(label))
    : undefined;

  const [isEntering, setIsEntering] = useState(animate);

  useEffect(() => {
    if (!animate) {
      return;
    }

    const timer = setTimeout(() => setIsEntering(false), animationDuration + 50);

    return () => clearTimeout(timer);
    // Deliberately mount-only (empty deps): this must fire exactly once per
    // mounted instance, regardless of how often props change afterward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chart = (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={margin}>
        {showGrid && <CartesianGrid strokeDasharray="2 2" stroke="var(--border)" />}

        {showXAxis && (
          <XAxis
            dataKey="x"
            type="number"
            ticks={xTicks}
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
        {(showYAxis || hasCustomYDomain) && (
          <YAxis
            dataKey="y"
            domain={yDomain}
            hide={!showYAxis}
            width={showYAxis ? yAxisWidth : 0}
            tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: "var(--text-4)" }}
            tickLine={false}
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
          type={curveType}
          dataKey="y"
          stroke={lineColor}
          strokeWidth={CHART_LINE_WIDTH}
          dot={false}
          isAnimationActive={isEntering}
          animationDuration={animationDuration}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const framedChart = framed ? <div className="mini-line-chart__frame">{chart}</div> : chart;

  if (!caption) {
    return framedChart;
  }

  return (
    <div className="mini-line-chart__wrapper">
      <div className="mini-line-chart__caption">{caption}</div>
      {framedChart}
    </div>
  );
}
