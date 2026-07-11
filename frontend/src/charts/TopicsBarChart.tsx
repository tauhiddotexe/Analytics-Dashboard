import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChartPoint } from '../types';

interface TopicsBarChartProps {
  data: ChartPoint[];
}

const PALETTE = ['#007aff', '#34c759', '#ff9500', '#ff3b30', '#af52de', '#5ac8fa', '#ff2d55', '#34c759'];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[12px] bg-white px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-[#e5e5ea]">
      <p className="text-[11px] text-[#86868b]">{label}</p>
      <p className="text-sm font-semibold text-[#1d1d1f]">{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export function TopicsBarChart({ data }: TopicsBarChartProps) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f2" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: '#86868b' }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5ea' }}
          domain={[0, 'auto']}
        />
        <YAxis
          dataKey="label"
          type="category"
          width={120}
          tick={{ fontSize: 10, fill: '#1d1d1f', fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f7' }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={20} animationDuration={800}>
          {data.map((_, idx) => (
            <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} opacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
