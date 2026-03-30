"use client";
import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  labels: string[];
  data: number[];
  target: number[];
}

export default function RadarChart({ labels, data, target }: Props) {
  const chartData = labels.map((label, i) => ({
    subject: label.length > 8 ? label.slice(0, 8) + "..." : label,
    current: data[i],
    required: target[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={380}>
      <RechartsRadar cx="50%" cy="50%" outerRadius="75%" data={chartData}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fill: "#64748b" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "#94a3b8" }}
        />
        <Radar
          name="必要レベル"
          dataKey="required"
          stroke="#2563eb"
          fill="#2563eb"
          fillOpacity={0.05}
          strokeDasharray="4 4"
          strokeWidth={1.5}
        />
        <Radar
          name="現状"
          dataKey="current"
          stroke="#dc2626"
          fill="#dc2626"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "#64748b" }}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
