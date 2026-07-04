import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { ChartPoint } from '../types';

interface RelevanceRadarChartProps {
  data: ChartPoint[];
}

export function RelevanceRadarChart({ data }: RelevanceRadarChartProps) {
  return (
    <ResponsiveContainer>
      <RadarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="label" tick={{ fontSize: 10, fill: '#475569' }} />
        <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          formatter={(value) => [Number(value).toFixed(1), 'Avg relevance']}
        />
        <Radar dataKey="value" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
