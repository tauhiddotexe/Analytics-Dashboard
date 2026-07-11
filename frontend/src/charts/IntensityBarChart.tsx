import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChartPoint } from '../types';

interface IntensityBarChartProps {
  data: ChartPoint[];
}

const COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#ea580c', '#0d9488', '#4f46e5', '#ca8a04', '#0284c7'];

function LollipopDot(props: { x?: number; y?: number; width?: number; height?: number; fill?: string; index?: number }) {
  const { x = 0, y = 0, width = 0, height = 0, fill = '#2563eb' } = props;
  const cx = x + width / 2;
  const top = y;
  const bottom = y + height;
  return (
    <g>
      <line x1={cx} y1={top} x2={cx} y2={bottom} stroke="#cbd5e1" strokeWidth={2} />
      <circle cx={cx} cy={top} r={6} fill={fill} stroke="#fff" strokeWidth={2} />
    </g>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-800">{payload[0].value.toFixed(1)}</p>
    </div>
  );
}

export function IntensityBarChart({ data }: IntensityBarChartProps) {
  const chartData = useMemo(() => {
    return [...data].filter((d) => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 12);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-slate-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
          angle={-25}
          textAnchor="end"
          height={64}
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          domain={[0, 'auto']}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="value" shape={<LollipopDot />} animationDuration={800}>
          {chartData.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
