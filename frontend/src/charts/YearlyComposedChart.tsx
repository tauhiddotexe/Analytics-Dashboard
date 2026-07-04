import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { YearlyPoint } from '../types';

interface YearlyComposedChartProps {
  data: YearlyPoint[];
}

const legendLabels: Record<string, string> = {
  average_intensity: 'Intensity',
  average_likelihood: 'Likelihood',
  average_relevance: 'Relevance',
  count: 'Records',
};

export function YearlyComposedChart({ data }: YearlyComposedChartProps) {
  return (
    <ResponsiveContainer>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748b' }} />
        <YAxis yAxisId="right" orientation="right" hide domain={[0, 'auto']} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          labelFormatter={(year) => `Year: ${year}`}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value: string) => legendLabels[value] ?? value}
        />
        <Bar yAxisId="left" dataKey="count" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={28} name="count" />
        <Line yAxisId="right" type="monotone" dataKey="average_intensity" stroke="#4f46e5" strokeWidth={2.5} dot={false} name="average_intensity" />
        <Line yAxisId="right" type="monotone" dataKey="average_likelihood" stroke="#059669" strokeWidth={2.5} dot={false} name="average_likelihood" />
        <Line yAxisId="right" type="monotone" dataKey="average_relevance" stroke="#d97706" strokeWidth={2.5} dot={false} name="average_relevance" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
