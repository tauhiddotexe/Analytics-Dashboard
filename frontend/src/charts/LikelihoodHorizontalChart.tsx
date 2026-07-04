import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChartPoint } from '../types';

interface LikelihoodHorizontalChartProps {
  data: ChartPoint[];
}

export function LikelihoodHorizontalChart({ data }: LikelihoodHorizontalChartProps) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
        <YAxis dataKey="label" type="category" width={130} tick={{ fontSize: 11, fill: '#475569' }} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          formatter={(value) => [Number(value).toFixed(1), 'Avg likelihood']}
        />
        <Bar dataKey="value" fill="#0891b2" radius={[0, 8, 8, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
