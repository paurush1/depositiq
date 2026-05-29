"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { MetricCard } from "@/components/ui/metric-card";
import { SelectInput, TextInput } from "@/components/ui/scenario-input";
import { useMarketData } from "@/components/use-market-data";
import {
  analyseCompetitorRates,
  formatPercent,
  getMarketStatusLabel,
  median
} from "@/lib/depositiq/prototype";

type SortKey = "headlineRate" | "bank" | "category" | "simplicityScore";

export function MarketIntelligenceWorkbench() {
  const { mode, setMode, data, loading, error, refresh } = useMarketData("live");
  const [search, setSearch] = useState("");
  const [bankFilter, setBankFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [rateTypeFilter, setRateTypeFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("headlineRate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => analyseCompetitorRates(data?.competitorRates ?? []), [data]);
  const banks = Array.from(new Set(rows.map((row) => row.bank)));
  const rateTypes = Array.from(new Set(rows.map((row) => row.rateType ?? "Indicative")));

  const filteredRows = useMemo(() => {
    const searched = rows.filter((row) => {
      const haystack = `${row.bank} ${row.productName}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });

    return searched
      .filter((row) => bankFilter === "All" || row.bank === bankFilter)
      .filter((row) => categoryFilter === "All" || row.category === categoryFilter)
      .filter((row) => sourceFilter === "All" || row.source === sourceFilter)
      .filter(
        (row) => rateTypeFilter === "All" || (row.rateType ?? "Indicative") === rateTypeFilter
      )
      .sort((left, right) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        const leftValue = left[sortKey];
        const rightValue = right[sortKey];

        if (typeof leftValue === "number" && typeof rightValue === "number") {
          return (leftValue - rightValue) * direction;
        }

        return String(leftValue).localeCompare(String(rightValue)) * direction;
      });
  }, [
    bankFilter,
    categoryFilter,
    rateTypeFilter,
    rows,
    search,
    sortDirection,
    sortKey,
    sourceFilter
  ]);

  const rateValues = filteredRows.map((row) => row.headlineRate);
  const average =
    rateValues.length > 0
      ? Number((rateValues.reduce((sum, value) => sum + value, 0) / rateValues.length).toFixed(2))
      : 0;
  const highest = rateValues.length > 0 ? Math.max(...rateValues) : 0;
  const lowest = rateValues.length > 0 ? Math.min(...rateValues) : 0;
  const rateBins = buildRateDistribution(rateValues);

  const columns = [
    {
      key: "bank",
      label: "Bank",
      header: (
        <SortButton
          label="Bank"
          active={sortKey === "bank"}
          direction={sortDirection}
          onClick={() => toggleSort("bank")}
        />
      ),
      render: (row: (typeof filteredRows)[number]) => (
        <div>
          <p className="font-medium text-slate-900">{row.bank}</p>
          <p className="text-slate-500">{row.brandName}</p>
        </div>
      )
    },
    {
      key: "product",
      label: "Product",
      render: (row: (typeof filteredRows)[number]) => (
        <div>
          <p className="font-medium text-slate-900">{row.productName}</p>
          <p className="text-slate-500">{row.conditionsSummary}</p>
        </div>
      )
    },
    {
      key: "category",
      label: "Product category",
      header: (
        <SortButton
          label="Product category"
          active={sortKey === "category"}
          direction={sortDirection}
          onClick={() => toggleSort("category")}
        />
      ),
      render: (row: (typeof filteredRows)[number]) => row.category
    },
    {
      key: "headlineRate",
      label: "Headline rate",
      align: "right" as const,
      header: (
        <SortButton
          label="Headline rate"
          active={sortKey === "headlineRate"}
          direction={sortDirection}
          onClick={() => toggleSort("headlineRate")}
        />
      ),
      render: (row: (typeof filteredRows)[number]) => (
        <span className="font-semibold text-slate-900">{formatPercent(row.headlineRate)}</span>
      )
    },
    {
      key: "simplicityScore",
      label: "Simplicity score",
      align: "right" as const,
      header: (
        <SortButton
          label="Simplicity score"
          active={sortKey === "simplicityScore"}
          direction={sortDirection}
          onClick={() => toggleSort("simplicityScore")}
        />
      ),
      render: (row: (typeof filteredRows)[number]) => row.simplicityScore.toFixed(0)
    },
    {
      key: "source",
      label: "Source",
      render: (row: (typeof filteredRows)[number]) => (
        <Badge tone={row.source === "CDR" ? "success" : "neutral"}>{row.source}</Badge>
      )
    }
  ];

  function toggleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "bank" || nextKey === "category" ? "asc" : "desc");
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Average rate" value={formatPercent(average)} />
        <MetricCard label="Median rate" value={formatPercent(median(rateValues))} />
        <MetricCard label="Highest rate" value={formatPercent(highest)} />
        <MetricCard label="Lowest rate" value={formatPercent(lowest)} />
        <MetricCard
          label="Products analysed"
          value={String(filteredRows.length)}
          hint={
            data ? `Data status: ${getMarketStatusLabel(data.summary.dataSourceStatus)}` : undefined
          }
        />
      </section>

      <FilterBar>
        <TextInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search bank or product"
        />
        <SelectInput value={bankFilter} onChange={(event) => setBankFilter(event.target.value)}>
          <option>All</option>
          {banks.map((bank) => (
            <option key={bank}>{bank}</option>
          ))}
        </SelectInput>
        <SelectInput
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option>All</option>
          <option>Savings</option>
          <option>Term Deposit</option>
        </SelectInput>
        <SelectInput
          value={sourceFilter}
          onChange={(event) => setSourceFilter(event.target.value)}
        >
          <option>All</option>
          <option>CDR</option>
          <option>Fallback</option>
        </SelectInput>
        <div className="flex gap-3">
          <SelectInput
            value={rateTypeFilter}
            onChange={(event) => setRateTypeFilter(event.target.value)}
          >
            <option>All</option>
            {rateTypes.map((rateType) => (
              <option key={rateType}>{rateType}</option>
            ))}
          </SelectInput>
          <Button tone="secondary" onClick={() => void refresh()}>
            Refresh market data
          </Button>
        </div>
      </FilterBar>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <DataTable columns={columns} rows={filteredRows} emptyState="No competitor products match the current filters." />

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-950">Rate distribution</p>
                <p className="mt-1 text-sm text-slate-500">
                  Public rates grouped into simple distribution bands.
                </p>
              </div>
              <SelectInput value={mode} onChange={(event) => setMode(event.target.value as "live" | "fallback")} className="max-w-[180px]">
                <option value="live">Live CDR mode</option>
                <option value="fallback">Fallback mode</option>
              </SelectInput>
            </div>
            <div className="mt-5 space-y-3">
              {rateBins.map((bin) => (
                <div key={bin.label}>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                    <span>{bin.label}</span>
                    <span>{bin.count}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-sky-500"
                      style={{ width: `${bin.width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-amber-900">Data caveat</p>
            <p className="mt-3 text-sm leading-6 text-amber-900">
              CDR rates are indicative and may include tiers, bonus conditions, eligibility
              rules and special conditions. Human review required.
            </p>
            {loading ? <p className="mt-3 text-sm text-slate-500">Refreshing data...</p> : null}
            {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
            {data?.summary.warnings?.length ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-900">
                {data.summary.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            ) : null}
          </section>
        </div>
      </section>
    </div>
  );
}

function SortButton({
  label,
  active,
  direction,
  onClick
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <button className="font-semibold text-slate-600 hover:text-slate-900" onClick={onClick}>
      {label} {active ? (direction === "asc" ? "↑" : "↓") : ""}
    </button>
  );
}

function buildRateDistribution(values: number[]) {
  const bins = [
    { label: "< 4.50%", min: -Infinity, max: 4.5 },
    { label: "4.50% - 4.74%", min: 4.5, max: 4.75 },
    { label: "4.75% - 4.99%", min: 4.75, max: 5 },
    { label: "5.00%+", min: 5, max: Infinity }
  ];
  const maxCount = Math.max(
    1,
    ...bins.map((bin) => values.filter((value) => value >= bin.min && value < bin.max).length)
  );

  return bins.map((bin) => {
    const count = values.filter((value) => value >= bin.min && value < bin.max).length;

    return {
      label: bin.label,
      count,
      width: (count / maxCount) * 100
    };
  });
}
