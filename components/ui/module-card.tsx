import Link from "next/link";
import type { ComponentProps } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ModuleCard({
  title,
  description,
  metric,
  href
}: {
  title: string;
  description: string;
  metric: string;
  href: ComponentProps<typeof Link>["href"];
}) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <Badge tone="info">Module</Badge>
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-500">Current insight</p>
        <p className="mt-2 text-sm font-medium text-slate-900">{metric}</p>
      </div>
      <div className="mt-5">
        <ButtonLink href={href} tone="secondary">
          Open module
        </ButtonLink>
      </div>
    </article>
  );
}
