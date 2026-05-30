"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar } from "@/components/ui/filter-bar";
import { InsightPanel } from "@/components/ui/insight-panel";
import { MetricCard } from "@/components/ui/metric-card";
import { MetricGrid, Section, TableSection, WorkbenchGrid } from "@/components/ui/page-layout";
import {
  ScenarioField,
  SelectInput,
  TextInput
} from "@/components/ui/scenario-input";
import {
  getLeverImpact,
  getSuggestedCampaignAction,
  scorePrimaryBanking,
  syntheticCustomers,
  type SyntheticCustomer
} from "@/lib/depositiq/prototype";

export function PrimaryBankingWorkbench() {
  const [segmentFilter, setSegmentFilter] = useState("All");
  const [scoreRangeFilter, setScoreRangeFilter] = useState("All");
  const [salaryFilter, setSalaryFilter] = useState("All");
  const [payIdFilter, setPayIdFilter] = useState("All");
  const [walletFilter, setWalletFilter] = useState("All");

  const customers = useMemo(() => syntheticCustomers.map(scorePrimaryBanking), []);
  const filteredCustomers = customers.filter((customer) => {
    if (segmentFilter !== "All" && customer.segment !== segmentFilter) return false;
    if (salaryFilter !== "All" && String(customer.salaryCredit) !== salaryFilter) return false;
    if (payIdFilter !== "All" && String(customer.payIdRegistered) !== payIdFilter) return false;
    if (walletFilter !== "All" && String(customer.walletProvisioned) !== walletFilter) return false;
    if (scoreRangeFilter === "75+" && customer.primaryBankingScore < 75) return false;
    if (
      scoreRangeFilter === "50-74" &&
      (customer.primaryBankingScore < 50 || customer.primaryBankingScore > 74)
    ) {
      return false;
    }
    if (scoreRangeFilter === "<50" && customer.primaryBankingScore >= 50) return false;
    return true;
  });

  const [sampleCustomer, setSampleCustomer] = useState<SyntheticCustomer>(syntheticCustomers[0]);
  const beforeScore = scorePrimaryBanking(syntheticCustomers[0]);
  const afterScore = scorePrimaryBanking(sampleCustomer);
  const scoreChange = afterScore.primaryBankingScore - beforeScore.primaryBankingScore;

  return (
    <div className="space-y-10">
      <Section>
        <MetricGrid className="xl:grid-cols-2 2xl:grid-cols-4">
          <MetricCard
            label="Primary relationships"
            value={String(
              customers.filter((customer) => customer.relationshipBand === "Primary relationship")
                .length
            )}
          />
          <MetricCard
            label="Emerging primary"
            value={String(
              customers.filter((customer) => customer.relationshipBand === "Emerging primary")
                .length
            )}
          />
          <MetricCard
            label="Secondary relationship"
            value={String(
              customers.filter((customer) => customer.relationshipBand === "Secondary relationship")
                .length
            )}
          />
          <MetricCard
            label="Rate chaser / low engagement"
            value={String(
              customers.filter(
                (customer) => customer.relationshipBand === "Rate chaser / low engagement"
              ).length
            )}
          />
        </MetricGrid>
      </Section>

      <Section>
        <WorkbenchGrid>
          <InsightPanel title="Why this matters">
            Primary banking behaviour shows whether deposits and payments are becoming
            part of the customer&apos;s daily financial life. Salary credits, wallet
            activation, PayID, card usage and recurring payments are stronger
            relationship signals than balance alone.
          </InsightPanel>

          <TableSection
            title="What-if panel"
            description="Toggle primacy levers for a sample customer and the score updates live."
          >
            <div className="grid gap-4">
              <ScenarioField label="Salary credit">
                <SelectInput
                  value={String(sampleCustomer.salaryCredit)}
                  onChange={(event) =>
                    setSampleCustomer((current) => ({
                      ...current,
                      salaryCredit: event.target.value === "true"
                    }))
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </SelectInput>
              </ScenarioField>
              <ScenarioField label="PayID registered">
                <SelectInput
                  value={String(sampleCustomer.payIdRegistered)}
                  onChange={(event) =>
                    setSampleCustomer((current) => ({
                      ...current,
                      payIdRegistered: event.target.value === "true"
                    }))
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </SelectInput>
              </ScenarioField>
              <ScenarioField label="Wallet provisioned">
                <SelectInput
                  value={String(sampleCustomer.walletProvisioned)}
                  onChange={(event) =>
                    setSampleCustomer((current) => ({
                      ...current,
                      walletProvisioned: event.target.value === "true"
                    }))
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </SelectInput>
              </ScenarioField>
              <ScenarioField label="Card usage per month">
                <TextInput
                  type="number"
                  value={String(sampleCustomer.cardUsagePerMonth)}
                  onChange={(event) =>
                    setSampleCustomer((current) => ({
                      ...current,
                      cardUsagePerMonth: Number(event.target.value)
                    }))
                  }
                />
              </ScenarioField>
            </div>
          </TableSection>
        </WorkbenchGrid>
      </Section>

      <Section>
        <InsightPanel title="Before / after score">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Before</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {beforeScore.primaryBankingScore}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">After</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {afterScore.primaryBankingScore}
              </p>
            </div>
          </div>
          <p className="mt-4 font-medium text-slate-900">
            Score movement: {scoreChange >= 0 ? "+" : ""}
            {scoreChange}
          </p>
          <p className="mt-2">{getLeverImpact(beforeScore, afterScore)}</p>
          <p className="mt-2">
            Suggested campaign action: {getSuggestedCampaignAction(scoreChange, afterScore)}
          </p>
          <p className="mt-2">Next-best action: {afterScore.nextBestAction}</p>
        </InsightPanel>
      </Section>

      <Section>
        <FilterBar>
          <SelectInput
            value={segmentFilter}
            onChange={(event) => setSegmentFilter(event.target.value)}
          >
            <option>All</option>
            <option>Mass market</option>
            <option>Affluent</option>
            <option>Digital first</option>
            <option>Young saver</option>
          </SelectInput>
          <SelectInput
            value={scoreRangeFilter}
            onChange={(event) => setScoreRangeFilter(event.target.value)}
          >
            <option>All</option>
            <option>75+</option>
            <option>50-74</option>
            <option>&lt;50</option>
          </SelectInput>
          <BooleanFilter value={salaryFilter} onChange={setSalaryFilter} label="Salary credit" />
          <BooleanFilter value={payIdFilter} onChange={setPayIdFilter} label="PayID registered" />
          <BooleanFilter
            value={walletFilter}
            onChange={setWalletFilter}
            label="Wallet provisioned"
          />
        </FilterBar>
      </Section>

      <TableSection
        title="Customer primacy table"
        description="Scan customer relationship depth, core behavioural signals, and next-best actions in one full-width workbench."
      >
        <DataTable
          columns={[
            {
              key: "customer",
              label: "Customer",
              render: (row: (typeof filteredCustomers)[number]) => (
                <div>
                  <p className="font-medium text-slate-900">{row.name}</p>
                  <p className="text-slate-500">{row.segment}</p>
                </div>
              )
            },
            {
              key: "score",
              label: "Primary banking score",
              render: (row: (typeof filteredCustomers)[number]) => row.primaryBankingScore
            },
            {
              key: "band",
              label: "Relationship band",
              render: (row: (typeof filteredCustomers)[number]) => (
                <Badge
                  tone={
                    row.relationshipBand === "Primary relationship"
                      ? "success"
                      : row.relationshipBand === "Emerging primary"
                        ? "info"
                        : row.relationshipBand === "Secondary relationship"
                          ? "warning"
                          : "danger"
                  }
                >
                  {row.relationshipBand}
                </Badge>
              )
            },
            {
              key: "signals",
              label: "Signals",
              render: (row: (typeof filteredCustomers)[number]) => (
                <div className="text-slate-500">
                  Salary credit: {row.salaryCredit ? "Yes" : "No"}
                  <br />
                  PayID: {row.payIdRegistered ? "Yes" : "No"}
                  <br />
                  Wallet: {row.walletProvisioned ? "Yes" : "No"}
                </div>
              )
            },
            {
              key: "action",
              label: "Next-best action",
              render: (row: (typeof filteredCustomers)[number]) => (
                <span className="font-medium text-slate-900">{row.nextBestAction}</span>
              )
            }
          ]}
          rows={filteredCustomers}
        />
      </TableSection>
    </div>
  );
}

function BooleanFilter({
  value,
  onChange,
  label
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <SelectInput value={value} onChange={(event) => onChange(event.target.value)}>
      <option>All</option>
      <option value="true">{label}: Yes</option>
      <option value="false">{label}: No</option>
    </SelectInput>
  );
}
