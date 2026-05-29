import type { ReactNode } from "react";

export function InsightPanel({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <div className="mt-3 text-base leading-7 text-slate-700">{children}</div>
    </section>
  );
}
