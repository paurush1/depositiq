import type { ReactNode } from "react";

export function FilterBar({
  children,
  className = "",
  gridClassName = ""
}: {
  children: ReactNode;
  className?: string;
  gridClassName?: string;
}) {
  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      <div className={`grid gap-3 lg:grid-cols-5 ${gridClassName}`}>{children}</div>
    </section>
  );
}
