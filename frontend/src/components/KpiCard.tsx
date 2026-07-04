interface KpiCardProps {
  label: string;
  value: string;
  accent: string;
}

export function KpiCard({ label, value, accent }: KpiCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
        {value}
      </p>
      <div className={`mt-4 h-1.5 rounded-full ${accent}`} />
    </article>
  );
}
