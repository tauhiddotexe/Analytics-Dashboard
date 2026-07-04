import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChartPoint } from '../types';

interface TopicsBarChartProps {
  data: ChartPoint[];
}

const PALETTE = ['#0f766e', '#115e59', '#14b8a6', '#2dd4bf', '#5eead4', '#ccfbf1', '#0d9488', '#134e4a'];

export function TopicsBarChart({ data }: TopicsBarChartProps) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" hide />
        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 'auto']} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          formatter={(value) => [Number(value), 'Records']}
          labelFormatter={(label) => `Topic: ${label}`}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={48}>
          {data.map((_, idx) => (
            <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
