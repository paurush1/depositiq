"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { InsightPanel } from "@/components/ui/insight-panel";
import { MetricCard } from "@/components/ui/metric-card";
import { MetricGrid, Section, TableSection, WorkbenchGrid } from "@/components/ui/page-layout";
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
    <div className="space-y-10">
      <Section>
        <MetricGrid className="xl:grid-cols-2 2xl:grid-cols-4">
          <MetricCard
            label="Average simplicity score"
            value={(
              filteredRows.reduce((sum, row) => sum + row.simplicityScore, 0) /
              Math.max(filteredRows.length, 1)
            ).toFixed(0)}
          />
          <MetricCard
            label="Average conditionality score"
            value={(
              filteredRows.reduce((sum, row) => sum + row.conditionalityScore, 0) /
              Math.max(filteredRows.length, 1)
            ).toFixed(0)}
          />
          <MetricCard
            label="High risk products"
            value={String(filteredRows.filter((row) => row.comprehensionRisk === "High").length)}
          />
          <MetricCard label="Products analysed" value={String(filteredRows.length)} />
        </MetricGrid>
      </Section>

      <Section>
        <WorkbenchGrid>
          <InsightPanel title="Why this matters">
            Product teams should not assume the product with the highest rate is the one
            customers trust most. Complexity can weaken both conversion and retention.
          </InsightPanel>

          <TableSection
            title="Headline rate vs simplicity"
            description="Compare rate strength against simplicity to identify products that look attractive on paper but feel hard to understand in practice."
            className="p-6"
          >
            <div className="space-y-4">
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
          </TableSection>
        </WorkbenchGrid>
      </Section>

      <Section>
        <InsightPanel title="Insight panel">
          A high headline rate may not translate into customer trust if customers struggle
          to understand the conditions.
        </InsightPanel>
      </Section>

      <TableSection
        title="Product complexity table"
        description="Use risk and category filters, then scan the full product view without changing the underlying complexity logic."
        actions={
          <FilterBar
            className="border-0 bg-transparent p-0 shadow-none"
            gridClassName="md:grid-cols-2 lg:grid-cols-2"
          >
            <SelectInput value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </SelectInput>
            <SelectInput
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option>All</option>
              <option>Savings</option>
              <option>Transaction</option>
              <option>Term Deposit</option>
            </SelectInput>
          </FilterBar>
        }
      >
        <DataTable
          tableClassName="min-w-[1500px]"
          columns={[
            {
              key: "productName",
              label: "Product name",
              sticky: true,
              className: "min-w-[260px] whitespace-nowrap bg-white font-medium text-slate-900",
              headerClassName: "min-w-[260px] whitespace-nowrap",
              render: (row: (typeof filteredRows)[number]) => row.productName
            },
            {
              key: "bank",
              label: "Bank",
              className: "min-w-[180px] whitespace-nowrap",
              headerClassName: "min-w-[180px] whitespace-nowrap",
              render: (row: (typeof filteredRows)[number]) => row.bank
            },
            {
              key: "category",
              label: "Category",
              className: "min-w-[140px] whitespace-nowrap",
              headerClassName: "min-w-[140px] whitespace-nowrap",
              render: (row: (typeof filteredRows)[number]) => row.category
            },
            {
              key: "headlineRate",
              label: "Headline rate",
              className: "min-w-[120px] whitespace-nowrap",
              headerClassName: "min-w-[120px] whitespace-nowrap",
              render: (row: (typeof filteredRows)[number]) => formatPercent(row.headlineRate)
            },
            {
              key: "simplicityScore",
              label: "Simplicity score",
              className: "min-w-[140px] whitespace-nowrap",
              headerClassName: "min-w-[140px] whitespace-nowrap",
              render: (row: (typeof filteredRows)[number]) => row.simplicityScore.toFixed(0)
            },
            {
              key: "conditionalityScore",
              label: "Conditionality score",
              className: "min-w-[160px] whitespace-nowrap",
              headerClassName: "min-w-[160px] whitespace-nowrap",
              render: (row: (typeof filteredRows)[number]) => row.conditionalityScore.toFixed(0)
            },
            {
              key: "risk",
              label: "Customer comprehension risk",
              className: "min-w-[210px] whitespace-nowrap",
              headerClassName: "min-w-[210px] whitespace-nowrap",
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
              className: "min-w-[320px]",
              headerClassName: "min-w-[320px]",
              render: (row: (typeof filteredRows)[number]) => getSimplificationOpportunity(row)
            }
          ]}
          rows={filteredRows}
        />
      </TableSection>
    </div>
  );
}
