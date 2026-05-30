"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { InsightPanel } from "@/components/ui/insight-panel";
import { MetricCard } from "@/components/ui/metric-card";
import { SelectInput } from "@/components/ui/scenario-input";
import { useMarketData } from "@/components/use-market-data";
import {
  analyseCompetitorRates,
  formatPercent,
  getSimplificationOpportunity
} from "@/lib/depositiq/prototype";

export function ProductComplexityWorkbench() {
  const { data } = useMarketData("live");
  const rows = useMemo(() => analyseCompetitorRates(data?.competitorRates ?? []), [data]);
  const [riskFilter, setRiskFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredRows = rows
    .filter((row) => riskFilter === "All" || row.comprehensionRisk === riskFilter)
    .filter((row) => categoryFilter === "All" || row.category === categoryFilter)
    .sort((a, b) => b.conditionalityScore - a.conditionalityScore);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Average simplicity score"
          value={(filteredRows.reduce((sum, row) => sum + row.simplicityScore, 0) / Math.max(filteredRows.length, 1)).toFixed(0)}
        />
        <MetricCard
          label="Average conditionality score"
          value={(filteredRows.reduce((sum, row) => sum + row.conditionalityScore, 0) / Math.max(filteredRows.length, 1)).toFixed(0)}
        />
        <MetricCard
          label="High risk products"
          value={String(filteredRows.filter((row) => row.comprehensionRisk === "High").length)}
        />
        <MetricCard label="Products analysed" value={String(filteredRows.length)} />
      </section>

      <FilterBar>
        <SelectInput value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </SelectInput>
        <SelectInput value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option>All</option>
          <option>Savings</option>
          <option>Transaction</option>
          <option>Term Deposit</option>
        </SelectInput>
      </FilterBar>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DataTable
          columns={[
            {
              key: "product",
              label: "Product",
              render: (row: (typeof filteredRows)[number]) => (
                <div>
                  <p className="font-medium text-slate-900">{row.productName}</p>
                  <p className="text-slate-500">{row.bank}</p>
                </div>
              )
            },
            {
              key: "category",
              label: "Category",
              render: (row: (typeof filteredRows)[number]) => row.category
            },
            {
              key: "headlineRate",
              label: "Headline rate",
              render: (row: (typeof filteredRows)[number]) => formatPercent(row.headlineRate)
            },
            {
              key: "simplicityScore",
              label: "Simplicity score",
              render: (row: (typeof filteredRows)[number]) => row.simplicityScore.toFixed(0)
            },
            {
              key: "conditionalityScore",
              label: "Conditionality score",
              render: (row: (typeof filteredRows)[number]) => row.conditionalityScore.toFixed(0)
            },
            {
              key: "risk",
              label: "Customer comprehension risk",
              render: (row: (typeof filteredRows)[number]) => (
                <Badge
                  tone={
                    row.comprehensionRisk === "High"
                      ? "danger"
                      : row.comprehensionRisk === "Medium"
                        ? "warning"
                        : "success"
                  }
                >
                  {row.comprehensionRisk}
                </Badge>
              )
            },
            {
              key: "opportunity",
              label: "Suggested simplification opportunity",
              render: (row: (typeof filteredRows)[number]) => getSimplificationOpportunity(row)
            }
          ]}
          rows={filteredRows}
        />

        <div className="space-y-6">
          <InsightPanel title="Why this matters">
            Product teams should not assume the product with the highest rate is the one
            customers trust most. Complexity can weaken both conversion and retention.
          </InsightPanel>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">Headline rate vs simplicity</p>
            <div className="mt-5 space-y-4">
              {filteredRows.slice(0, 6).map((row) => (
                <div key={`${row.bank}-${row.productName}`}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{row.productName}</span>
                    <span className="text-slate-500">{row.simplicityScore.toFixed(0)} / 100</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-sky-500"
                      style={{ width: `${row.simplicityScore}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatPercent(row.headlineRate)} headline rate
                  </p>
                </div>
              ))}
            </div>
          </section>

          <InsightPanel title="Insight panel">
            A high headline rate may not translate into customer trust if customers struggle
            to understand the conditions.
          </InsightPanel>
        </div>
      </section>
    </div>
  );
}
