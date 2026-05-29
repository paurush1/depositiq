"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { productModules } from "@/lib/depositiq/prototype";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f8fc_0%,#eef4fb_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/80 px-5 py-6 backdrop-blur xl:block">
          <Link href="/" className="block rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">DepositIQ</p>
                <p className="mt-1 text-sm text-slate-300">
                  Deposits and payments decisioning
                </p>
              </div>
              <Badge tone="info">Prototype</Badge>
            </div>
          </Link>

          <nav className="mt-6 space-y-2">
            {productModules.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 transition ${
                    active
                      ? "bg-sky-50 text-sky-900 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.2)]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.shortDescription}</p>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-lg font-semibold text-slate-950">DepositIQ</p>
                <p className="text-sm text-slate-500">
                  Portfolio-grade product prototype using public market data,
                  synthetic behavioural data and deterministic decision logic.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="neutral">Public CDR + synthetic data</Badge>
                <Badge tone="success">Fallback resilient</Badge>
              </div>
            </div>
            <div className="overflow-x-auto border-t border-slate-100 px-4 py-3 xl:hidden sm:px-6 lg:px-8">
              <div className="flex min-w-max gap-2">
                {productModules.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-sky-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

          <footer className="border-t border-slate-200 bg-white/80 px-4 py-5 text-sm text-slate-500 sm:px-6 lg:px-8">
            DepositIQ is a portfolio product prototype. It uses public product reference
            data where available and synthetic customer/feedback data. It does not
            represent any bank&apos;s internal systems, customers, strategy or proprietary
            data.
          </footer>
        </div>
      </div>
    </div>
  );
}
