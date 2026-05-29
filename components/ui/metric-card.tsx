import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function MetricCard({
  label,
  value,
  hint,
  badge
}: {
  label: string;
  value: string;
  hint?: string;
  badge?: ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {badge ? <Badge tone="neutral">{badge}</Badge> : null}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      {hint ? <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p> : null}
    </article>
  );
}
