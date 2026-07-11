import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import type { ChartPoint } from '../types';

interface LikelihoodHorizontalChartProps {
  data: ChartPoint[];
}

const COLORS = ['#059669', '#0891b2', '#2563eb', '#7c3aed', '#d97706', '#dc2626', '#db2777', '#ea580c', '#0d9488', '#4f46e5'];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-800">{payload[0].value.toFixed(1)}</p>
    </div>
  );
}

export function LikelihoodHorizontalChart({ data }: LikelihoodHorizontalChartProps) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
          domain={[0, 'auto']}
        />
        <YAxis
          dataKey="label"
          type="category"
          width={140}
          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={18} animationDuration={800}>
          {data.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
