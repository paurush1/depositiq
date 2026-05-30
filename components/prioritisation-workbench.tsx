"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { InsightPanel } from "@/components/ui/insight-panel";
import { MetricCard } from "@/components/ui/metric-card";
import { MetricGrid, Section, TableSection, WorkbenchGrid } from "@/components/ui/page-layout";
import { ScenarioField, TextInput } from "@/components/ui/scenario-input";
import {
  defaultPrioritisationWeights,
  rankInitiatives,
  type PrioritisationWeights
} from "@/lib/depositiq/prototype";

export function PrioritisationWorkbench() {
  const [weights, setWeights] = useState<PrioritisationWeights>(defaultPrioritisationWeights);
  const ranked = useMemo(() => rankInitiatives(weights), [weights]);
  const topThree = ranked.slice(0, 3);

  function setWeight(key: keyof PrioritisationWeights, value: string) {
    setWeights((current) => ({
      ...current,
      [key]: Number(value)
    }));
  }

  return (
    <div className="space-y-10">
      <Section>
        <MetricGrid className="xl:grid-cols-2 2xl:grid-cols-4">
          <MetricCard label="Top initiative score" value={ranked[0].priorityScore.toFixed(2)} />
          <MetricCard
            label="Top 3 initiatives"
            value={topThree.map((item) => item.name).join(", ")}
          />
          <MetricCard
            label="Highest market pressure"
            value={String(Math.max(...ranked.map((item) => item.marketPressure)))}
          />
          <MetricCard
            label="Highest risk reduction"
            value={String(Math.max(...ranked.map((item) => item.riskReduction)))}
          />
        </MetricGrid>
      </Section>

      <Section>
        <InsightPanel title="Why this matters">
          Prioritisation should make trade-offs explicit. A strong roadmap balances
          commercial value, customer impact, risk reduction, market pressure,
          primacy uplift and delivery complexity.
        </InsightPanel>
      </Section>

      <Section>
        <WorkbenchGrid>
          <TableSection
            title="Weighting controls"
            description="Tune the prioritisation model without crowding the roadmap table. Changes update the ranking instantly."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <WeightInput
                label="Commercial value weight"
                value={weights.commercialValue}
                onChange={(value) => setWeight("commercialValue", value)}
              />
              <WeightInput
                label="Customer value weight"
                value={weights.customerValue}
                onChange={(value) => setWeight("customerValue", value)}
              />
              <WeightInput
                label="Risk reduction weight"
                value={weights.riskReduction}
                onChange={(value) => setWeight("riskReduction", value)}
              />
              <WeightInput
                label="Strategic fit weight"
                value={weights.strategicFit}
                onChange={(value) => setWeight("strategicFit", value)}
              />
              <WeightInput
                label="Market pressure weight"
                value={weights.marketPressure}
                onChange={(value) => setWeight("marketPressure", value)}
              />
              <WeightInput
                label="Primacy uplift weight"
                value={weights.primacyUplift}
                onChange={(value) => setWeight("primacyUplift", value)}
              />
              <WeightInput
                label="Effort penalty"
                value={weights.effortPenalty}
                onChange={(value) => setWeight("effortPenalty", value)}
              />
              <WeightInput
                label="Dependency penalty"
                value={weights.dependencyPenalty}
                onChange={(value) => setWeight("dependencyPenalty", value)}
              />
            </div>
          </TableSection>

          <div className="space-y-6">
            <TableSection
              title="Top 3 initiatives"
              description="Keep the strongest roadmap actions prominent while the ranking updates."
              className="p-6"
            >
              <div className="space-y-4">
                {topThree.map((initiative, index) => (
                  <div key={initiative.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">
                        {index + 1}. {initiative.name}
                      </p>
                      <Badge tone="info">{initiative.priorityScore.toFixed(2)}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{initiative.whyNow}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Suggested experiment: {initiative.suggestedExperiment}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {initiative.sourceSignals.map((signal) => (
                        <Badge key={signal} tone="neutral">
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TableSection>

            <InsightPanel title="Why now">
              <div className="space-y-4">
                <p>{topThree[0].whyNow}</p>
                <p>Expected metric impact: {topThree[0].expectedMetricImpact}</p>
                <p>Key stakeholders: {topThree[0].keyStakeholders}</p>
                <p>Delivery risk: {topThree[0].deliveryRisk}</p>
                <p>Suggested experiment: {topThree[0].suggestedExperiment}</p>
                <div className="flex flex-wrap gap-2">
                  {topThree[0].sourceSignals.map((signal) => (
                    <Badge key={signal} tone="neutral">
                      {signal}
                    </Badge>
                  ))}
                </div>
                <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Prioritisation should be reviewed with Product, Technology, Risk,
                  Operations, Finance, Treasury and Distribution.
                </p>
              </div>
            </InsightPanel>
          </div>
        </WorkbenchGrid>
      </Section>

      <TableSection
        title="Ranked roadmap table"
        description="Use the full-width ranking view after adjusting weights so the source signals, delivery risk and stakeholders stay easy to scan."
      >
        <DataTable
          columns={[
            {
              key: "initiative",
              label: "Initiative",
              render: (row: (typeof ranked)[number]) => (
                <div>
                  <p className="font-medium text-slate-900">{row.name}</p>
                  <p className="text-slate-500">{row.expectedMetricImpact}</p>
                </div>
              )
            },
            {
              key: "score",
              label: "Ranked score",
              render: (row: (typeof ranked)[number]) => row.priorityScore.toFixed(2)
            },
            {
              key: "deliveryRisk",
              label: "Delivery risk",
              render: (row: (typeof ranked)[number]) => (
                <Badge
                  tone={
                    row.deliveryRisk === "High"
                      ? "danger"
                      : row.deliveryRisk === "Medium"
                        ? "warning"
                        : "success"
                  }
                >
                  {row.deliveryRisk}
                </Badge>
              )
            },
            {
              key: "signals",
              label: "Source signals",
              render: (row: (typeof ranked)[number]) => (
                <div className="flex flex-wrap gap-2">
                  {row.sourceSignals.map((signal) => (
                    <Badge key={signal} tone="neutral">
                      {signal}
                    </Badge>
                  ))}
                </div>
              )
            },
            {
              key: "stakeholders",
              label: "Key stakeholders",
              render: (row: (typeof ranked)[number]) => row.keyStakeholders
            }
          ]}
          rows={ranked}
        />
      </TableSection>
    </div>
  );
}

function WeightInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <ScenarioField label={label}>
      <TextInput
        type="number"
        step="0.1"
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
      />
    </ScenarioField>
  );
}
