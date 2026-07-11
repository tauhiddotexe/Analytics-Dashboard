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
  count: '#0891b2',
  average_intensity: '#2563eb',
  average_likelihood: '#059669',
  average_relevance: '#d97706',
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-slate-500">Year: {label}</p>
      <div className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <p key={entry.name} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[entry.name as keyof typeof CHART_COLORS] ?? '#94a3b8' }} />
            <span className="text-slate-600">{legendLabels[entry.name] ?? entry.name}:</span>
            <span className="font-bold text-slate-800">{entry.value.toFixed(1)}</span>
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
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          domain={[0, 'auto']}
        />
        <YAxis yAxisId="right" orientation="right" hide domain={[0, 'auto']} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} formatter={legendFormatter} iconType="circle" iconSize={8} />
        <Bar yAxisId="left" dataKey="count" fill={CHART_COLORS.count} radius={[4, 4, 0, 0]} maxBarSize={20} name="count" animationDuration={800} opacity={0.6} />
        <Line yAxisId="right" type="monotone" dataKey="average_intensity" stroke={CHART_COLORS.average_intensity} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: CHART_COLORS.average_intensity, strokeWidth: 3, stroke: '#fff' }} name="average_intensity" animationDuration={800} />
        <Line yAxisId="right" type="monotone" dataKey="average_likelihood" stroke={CHART_COLORS.average_likelihood} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: CHART_COLORS.average_likelihood, strokeWidth: 3, stroke: '#fff' }} name="average_likelihood" animationDuration={800} />
        <Line yAxisId="right" type="monotone" dataKey="average_relevance" stroke={CHART_COLORS.average_relevance} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: CHART_COLORS.average_relevance, strokeWidth: 3, stroke: '#fff' }} name="average_relevance" animationDuration={800} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
