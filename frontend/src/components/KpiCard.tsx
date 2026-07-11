import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface KpiCardProps {
  label: string;
  value: number;
  decimals?: number;
  color?: string;
}

function formatValue(value: number, decimals?: number): string {
  if (value === 0) return '0';
  if (decimals !== undefined) return value.toFixed(decimals);
  return value.toLocaleString();
}

export function KpiCard({ label, value, decimals, color = '#2563eb' }: KpiCardProps) {
  const animated = useAnimatedCounter(value, 1200, value > 0);

  return (
    <div className="relative rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm overflow-hidden sm:px-4 sm:py-3.5">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ backgroundColor: color }} />
      <p className="text-[10px] font-medium text-slate-500 sm:text-xs">{label}</p>
      <p className="mt-0.5 text-lg font-bold tracking-tight text-slate-900 tabular-nums sm:mt-1 sm:text-2xl">
        {formatValue(animated, decimals)}
      </p>
      <div className="mt-1.5 h-0.5 w-6 rounded-full sm:mt-2 sm:w-8" style={{ backgroundColor: color, opacity: 0.3 }} />
    </div>
  );
}
