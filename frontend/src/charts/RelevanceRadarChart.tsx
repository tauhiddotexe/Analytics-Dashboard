import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { ChartPoint } from '../types';

interface RelevanceRadarChartProps {
  data: ChartPoint[];
}

const CHART_COLOR = '#d97706';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number; name: string }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-slate-500">{payload[0].name}</p>
      <p className="text-sm font-bold text-slate-800">{payload[0].value.toFixed(1)}</p>
    </div>
  );
}

export function RelevanceRadarChart({ data }: RelevanceRadarChartProps) {
  return (
    <ResponsiveContainer>
      <RadarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
          tickLine={false}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 'auto']}
          tick={{ fontSize: 9, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          dataKey="value"
          stroke={CHART_COLOR}
          strokeWidth={2.5}
          fill={CHART_COLOR}
          fillOpacity={0.25}
          animationDuration={800}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
