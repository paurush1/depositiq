import Link from "next/link";
import type { ComponentProps } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ModuleCard({
  title,
  description,
  whyItMatters,
  keyDecision,
  href
}: {
  title: string;
  description: string;
  whyItMatters: string;
  keyDecision: string;
  href: ComponentProps<typeof Link>["href"];
}) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <Badge tone="info">Module</Badge>
      </div>
      <div className="mt-4 space-y-4 flex-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            What it does
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Why it matters
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{whyItMatters}</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-500">Key decision supported</p>
        <p className="mt-2 text-sm font-medium text-slate-900">{keyDecision}</p>
      </div>
      <div className="mt-5">
        <ButtonLink href={href} tone="secondary">
          Open module
        </ButtonLink>
      </div>
    </article>
  );
}
