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

export function KpiCard({ label, value, decimals, color = '#007aff' }: KpiCardProps) {
  const animated = useAnimatedCounter(value, 1200, value > 0);

  return (
    <div className="card-apple px-4 py-4 sm:px-5 sm:py-5">
      <p className="text-[11px] font-medium tracking-wide text-[#86868b] uppercase">{label}</p>
      <p className="mt-1 text-[28px] font-bold tracking-tight text-[#1d1d1f] tabular-nums sm:text-[32px]">
        {formatValue(animated, decimals)}
      </p>
      <div className="mt-2 h-[3px] w-8 rounded-full" style={{ backgroundColor: color, opacity: 0.5 }} />
    </div>
  );
}
