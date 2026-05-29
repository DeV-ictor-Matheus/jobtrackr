"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendChartDatum {
  label: string;
  count: number;
}

interface ApplicationsTrendChartProps {
  data: TrendChartDatum[];
}

export default function ApplicationsTrendChart({
  data,
}: ApplicationsTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="applicationsTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tick={{ fill: "#a1a1aa" }}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={32}
          tick={{ fill: "#a1a1aa" }}
        />
        <Tooltip
          cursor={{ stroke: "#27272a" }}
          contentStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #27272a",
            borderRadius: "0.75rem",
            color: "#f5f5f5",
          }}
          labelStyle={{ color: "#f5f5f5" }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#applicationsTrend)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
