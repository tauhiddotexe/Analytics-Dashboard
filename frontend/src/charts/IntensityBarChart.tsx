import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChartPoint } from '../types';

interface IntensityBarChartProps {
  data: ChartPoint[];
}

const COLORS = ['#007aff', '#34c759', '#ff9500', '#ff3b30', '#af52de', '#5ac8fa', '#ff2d55', '#ffcc00', '#34c759', '#5856d6', '#ff9500', '#5ac8fa'];

function LollipopDot(props: { x?: number; y?: number; width?: number; height?: number; fill?: string; index?: number }) {
  const { x = 0, y = 0, width = 0, height = 0, fill = '#007aff' } = props;
  const cx = x + width / 2;
  const top = y;
  const bottom = y + height;
  return (
    <g>
      <line x1={cx} y1={top} x2={cx} y2={bottom} stroke="#e5e5ea" strokeWidth={1.5} />
      <circle cx={cx} cy={top} r={5} fill={fill} stroke="#fff" strokeWidth={2} />
    </g>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[12px] bg-white px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-[#e5e5ea]">
      <p className="text-[11px] text-[#86868b]">{label}</p>
      <p className="text-sm font-semibold text-[#1d1d1f]">{payload[0].value.toFixed(1)}</p>
    </div>
  );
}

export function IntensityBarChart({ data }: IntensityBarChartProps) {
  const chartData = useMemo(() => {
    return [...data].filter((d) => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 12);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-[#86868b]">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f2" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: '#86868b', fontWeight: 500 }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5ea' }}
          angle={-25}
          textAnchor="end"
          height={64}
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#86868b' }}
          tickLine={false}
          axisLine={false}
          domain={[0, 'auto']}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f7' }} />
        <Bar dataKey="value" shape={<LollipopDot />} animationDuration={800}>
          {chartData.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
