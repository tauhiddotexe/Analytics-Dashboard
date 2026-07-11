import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { YearlyPoint } from '../types';

interface YearlyComposedChartProps {
  data: YearlyPoint[];
}

const legendLabels: Record<string, string> = {
  average_intensity: 'Intensity',
  average_likelihood: 'Likelihood',
  average_relevance: 'Relevance',
  count: 'Record volume',
};

const CHART_COLORS = {
  count: '#5ac8fa',
  average_intensity: '#007aff',
  average_likelihood: '#34c759',
  average_relevance: '#ff9500',
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[12px] bg-white px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-[#e5e5ea]">
      <p className="text-[11px] text-[#86868b]">Year: {label}</p>
      <div className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <p key={entry.name} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[entry.name as keyof typeof CHART_COLORS] ?? '#c7c7cc' }} />
            <span className="text-[#86868b]">{legendLabels[entry.name] ?? entry.name}:</span>
            <span className="font-semibold text-[#1d1d1f]">{entry.value.toFixed(1)}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

const legendFormatter = (value: string) => legendLabels[value] ?? value;

export function YearlyComposedChart({ data }: YearlyComposedChartProps) {
  return (
    <ResponsiveContainer>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f2" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10, fill: '#86868b', fontWeight: 500 }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5ea' }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 10, fill: '#86868b' }}
          tickLine={false}
          axisLine={false}
          domain={[0, 'auto']}
        />
        <YAxis yAxisId="right" orientation="right" hide domain={[0, 'auto']} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} formatter={legendFormatter} iconType="circle" iconSize={7} />
        <Bar yAxisId="left" dataKey="count" fill={CHART_COLORS.count} radius={[4, 4, 0, 0]} maxBarSize={18} name="count" animationDuration={800} opacity={0.5} />
        <Line yAxisId="right" type="monotone" dataKey="average_intensity" stroke={CHART_COLORS.average_intensity} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: CHART_COLORS.average_intensity, strokeWidth: 2, stroke: '#fff' }} name="average_intensity" animationDuration={800} />
        <Line yAxisId="right" type="monotone" dataKey="average_likelihood" stroke={CHART_COLORS.average_likelihood} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: CHART_COLORS.average_likelihood, strokeWidth: 2, stroke: '#fff' }} name="average_likelihood" animationDuration={800} />
        <Line yAxisId="right" type="monotone" dataKey="average_relevance" stroke={CHART_COLORS.average_relevance} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: CHART_COLORS.average_relevance, strokeWidth: 2, stroke: '#fff' }} name="average_relevance" animationDuration={800} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
