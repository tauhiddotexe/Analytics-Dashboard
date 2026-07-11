import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { IconDatabase, IconBolt, IconStar, IconTarget } from '../lib/icons';

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

const KPI_META: Record<string, { icon: typeof IconDatabase; desc: string }> = {
  'Total records': { icon: IconDatabase, desc: 'Total records in the dataset' },
  'Average intensity': { icon: IconBolt, desc: 'Average intensity score across all records' },
  'Average likelihood': { icon: IconTarget, desc: 'Average likelihood score across all records' },
  'Average relevance': { icon: IconStar, desc: 'Average relevance score across all records' },
};

export function KpiCard({ label, value, decimals, color = '#007aff' }: KpiCardProps) {
  const animated = useAnimatedCounter(value, 1400, value > 0);
  const meta = KPI_META[label];
  const IconComponent = meta?.icon ?? IconDatabase;

  return (
    <div className="card-apple px-4 py-4 sm:px-5 sm:py-5 group relative overflow-hidden">
      <div
        className="absolute -bottom-4 -right-4 opacity-[0.04] transition-all duration-500 group-hover:opacity-[0.07] group-hover:scale-110 group-hover:-translate-x-1 group-hover:-translate-y-1"
        aria-hidden
      >
        <IconComponent size={80} strokeWidth={1} />
      </div>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${color}06 0%, transparent 60%)` }}
      />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm"
            style={{ backgroundColor: `${color}14` }}
          >
            <IconComponent size={15} color={color} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold tracking-wider text-[#86868b] uppercase truncate">{label}</p>
            {meta && <p className="text-[9px] text-[#c7c7cc] truncate">{meta.desc}</p>}
          </div>
        </div>
        <p className="mt-2 text-[30px] font-bold tracking-tight text-[#1d1d1f] tabular-nums sm:text-[36px] leading-none">
          {formatValue(animated, decimals)}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div
            className="h-[3px] rounded-full transition-all duration-500 ease-out group-hover:w-14"
            style={{ width: '1.5rem', backgroundColor: color, opacity: 0.5 }}
          />
          <div className="h-[3px] flex-1 rounded-full" style={{ backgroundColor: color, opacity: 0.06 }} />
        </div>
      </div>
    </div>
  );
}
