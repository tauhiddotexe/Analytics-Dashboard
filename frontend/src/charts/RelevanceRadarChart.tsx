import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { ChartPoint } from '../types';

interface RelevanceRadarChartProps {
  data: ChartPoint[];
}

const CHART_COLOR = '#ff9500';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number; name: string }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[12px] bg-white px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-[#e5e5ea]">
      <p className="text-[11px] text-[#86868b]">{payload[0].name}</p>
      <p className="text-sm font-semibold text-[#1d1d1f]">{payload[0].value.toFixed(1)}</p>
    </div>
  );
}

export function RelevanceRadarChart({ data }: RelevanceRadarChartProps) {
  return (
    <ResponsiveContainer>
      <RadarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <PolarGrid stroke="#e5e5ea" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: '#1d1d1f', fontWeight: 600 }}
          tickLine={false}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 'auto']}
          tick={{ fontSize: 9, fill: '#86868b' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          dataKey="value"
          stroke={CHART_COLOR}
          strokeWidth={2.5}
          fill={CHART_COLOR}
          fillOpacity={0.2}
          animationDuration={800}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
