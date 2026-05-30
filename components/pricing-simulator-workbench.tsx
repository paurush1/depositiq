"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { InsightPanel } from "@/components/ui/insight-panel";
import { MetricCard } from "@/components/ui/metric-card";
import {
  ScenarioField,
  SelectInput,
  TextInput
} from "@/components/ui/scenario-input";
import { useMarketData } from "@/components/use-market-data";
import { formatCurrency, formatPercent } from "@/lib/depositiq/prototype";

const scenarioTemplates = {
  "Base case": {
    proposedRateAdjust: -0.15,
    expectedBalanceGrowth: 2,
    expectedChurnReduction: 1,
    cannibalisation: 12,
    campaignDuration: 6
  },
  "Defensive rate increase": {
    proposedRateAdjust: 0.1,
    expectedBalanceGrowth: 6,
    expectedChurnReduction: 4,
    cannibalisation: 20,
    campaignDuration: 6
  },
  "Targeted promo": {
    proposedRateAdjust: 0.2,
    expectedBalanceGrowth: 5,
    expectedChurnReduction: 5,
    cannibalisation: 8,
    campaignDuration: 4
  },
  "Simplicity-led offer": {
    proposedRateAdjust: 0.02,
    expectedBalanceGrowth: 3.5,
    expectedChurnReduction: 2.5,
    cannibalisation: 6,
    campaignDuration: 6
  },
  "Custom scenario": {
    proposedRateAdjust: 0,
    expectedBalanceGrowth: 3,
    expectedChurnReduction: 2,
    cannibalisation: 10,
    campaignDuration: 6
  }
} as const;

type ScenarioName = keyof typeof scenarioTemplates;

export function PricingSimulatorWorkbench() {
  const { data } = useMarketData("live");
  const marketAverage = data?.summary.marketAverageRate ?? 4.82;
  const highestRate = data?.summary.highestCompetitorRate ?? 5.1;
  const cashRate = data?.cashRate.cashRateTarget ?? 4.35;

  const [scenario, setScenario] = useState<ScenarioName>("Base case");
  const [customerSegment, setCustomerSegment] = useState("Mass market saver");
  const [currentRate, setCurrentRate] = useState("4.40");
  const [proposedRate, setProposedRate] = useState(String(Number((marketAverage - 0.15).toFixed(2))));
  const [currentBalance, setCurrentBalance] = useState("12000");
  const [customerCount, setCustomerCount] = useState("18000");
  const [expectedBalanceGrowth, setExpectedBalanceGrowth] = useState("2");
  const [expectedChurnReduction, setExpectedChurnReduction] = useState("1");
  const [cannibalisation, setCannibalisation] = useState("12");
  const [campaignDuration, setCampaignDuration] = useState("6");
  const [depositBeta, setDepositBeta] = useState("0.55");
  const [conductRisk, setConductRisk] = useState("Medium");
  const [complexityLevel, setComplexityLevel] = useState("Medium");

  useEffect(() => {
    const template = scenarioTemplates[scenario];
    setExpectedBalanceGrowth(String(template.expectedBalanceGrowth));
    setExpectedChurnReduction(String(template.expectedChurnReduction));
    setCannibalisation(String(template.cannibalisation));
    setCampaignDuration(String(template.campaignDuration));
    setProposedRate(String(Number((marketAverage + template.proposedRateAdjust).toFixed(2))));
  }, [marketAverage, scenario]);

  const numeric = useMemo(() => {
    const currentRateValue = Number(currentRate);
    const proposedRateValue = Number(proposedRate);
    const currentBalanceValue = Number(currentBalance);
    const customerCountValue = Number(customerCount);
    const expectedBalanceGrowthValue = Number(expectedBalanceGrowth);
    const expectedChurnReductionValue = Number(expectedChurnReduction);
    const cannibalisationValue = Number(cannibalisation);
    const campaignDurationValue = Number(campaignDuration);
    const depositBetaValue = Number(depositBeta);
    const portfolioBalance = currentBalanceValue * customerCountValue;
    const currentAnnualInterestCost = portfolioBalance * (currentRateValue / 100);
    const proposedAnnualInterestCost = portfolioBalance * (proposedRateValue / 100);
    const incrementalAnnualCost = proposedAnnualInterestCost - currentAnnualInterestCost;
    const campaignPeriodIncrementalCost =
      incrementalAnnualCost * (campaignDurationValue / 12);
    const estimatedAcquiredBalances =
      portfolioBalance *
      (expectedBalanceGrowthValue / 100) *
      Math.max(0, 1 - cannibalisationValue / 100) *
      depositBetaValue;
    const estimatedRetainedBalances =
      portfolioBalance * (expectedChurnReductionValue / 100) * depositBetaValue;
    const rateGapToMarketAverage = Number((proposedRateValue - marketAverage).toFixed(2));
    const rateGapToHighestCompetitor = Number((proposedRateValue - highestRate).toFixed(2));
    const spreadToRbaCashRate = Number((proposedRateValue - cashRate).toFixed(2));
    const competitorPressure: "Low" | "Medium" | "High" =
      rateGapToMarketAverage < -0.5 ? "High" : rateGapToMarketAverage < -0.1 ? "Medium" : "Low";
    const marginPressure: "Low" | "Medium" | "High" =
      spreadToRbaCashRate > 1 || proposedRateValue > highestRate + 0.1
        ? "High"
        : spreadToRbaCashRate > 0.6
          ? "Medium"
          : "Low";

    return {
      currentRateValue,
      proposedRateValue,
      currentAnnualInterestCost,
      proposedAnnualInterestCost,
      incrementalAnnualCost,
      campaignPeriodIncrementalCost,
      estimatedAcquiredBalances,
      estimatedRetainedBalances,
      rateGapToMarketAverage,
      rateGapToHighestCompetitor,
      spreadToRbaCashRate,
      competitorPressure,
      marginPressure
    };
  }, [
    campaignDuration,
    cannibalisation,
    cashRate,
    currentBalance,
    currentRate,
    customerCount,
    depositBeta,
    expectedBalanceGrowth,
    expectedChurnReduction,
    highestRate,
    marketAverage,
    proposedRate
  ]);

  const recommendation = buildRecommendation({
    competitorPressure: numeric.competitorPressure,
    marginPressure: numeric.marginPressure,
    rateGapToMarketAverage: numeric.rateGapToMarketAverage,
    spreadToRbaCashRate: numeric.spreadToRbaCashRate,
    incrementalAnnualCost: numeric.incrementalAnnualCost
  });

  const scenarioRows = [
    {
      name: "Base case",
      proposedRate: marketAverage - 0.15,
      pressure: marketAverage - 0.15 - marketAverage < -0.1 ? "Medium" : "Low"
    },
    {
      name: "Defensive rate increase",
      proposedRate: marketAverage + 0.1,
      pressure: "Low"
    },
    {
      name: "Targeted promo",
      proposedRate: highestRate + 0.05,
      pressure: "Low"
    },
    {
      name: "Simplicity-led offer",
      proposedRate: marketAverage + 0.02,
      pressure: "Low"
    },
    {
      name: "Custom scenario",
      proposedRate: numeric.proposedRateValue,
      pressure: numeric.competitorPressure
    }
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <ScenarioField label="Customer segment">
            <SelectInput value={customerSegment} onChange={(event) => setCustomerSegment(event.target.value)}>
              <option>Mass market saver</option>
              <option>Affluent saver</option>
              <option>Rate sensitive</option>
              <option>Transaction-led primary</option>
              <option>High-balance retention</option>
            </SelectInput>
          </ScenarioField>
          <ScenarioField label="Scenario comparison">
            <SelectInput
              value={scenario}
              onChange={(event) => setScenario(event.target.value as ScenarioName)}
            >
              {Object.keys(scenarioTemplates).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </SelectInput>
          </ScenarioField>
        </div>
        <InsightPanel title="Scenario guidance">
          Select a scenario, then edit the assumptions directly. Every pricing metric and
          recommendation updates live, including competitor pressure, margin pressure,
          funding-cost implications and campaign-period cost.
        </InsightPanel>
      </section>

      <InsightPanel title="Why this matters">
        Deposit pricing is a commercial, behavioural and governance decision. Product
        teams need to assess rate gaps, balance response, funding cost, cannibalisation,
        campaign duration and conduct risk before repricing.
      </InsightPanel>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ScenarioField label="Current rate">
          <TextInput type="number" step="0.01" value={currentRate} onChange={(event) => setCurrentRate(event.target.value)} />
        </ScenarioField>
        <ScenarioField label="Proposed rate">
          <TextInput type="number" step="0.01" value={proposedRate} onChange={(event) => setProposedRate(event.target.value)} />
        </ScenarioField>
        <ScenarioField label="Current balance">
          <TextInput type="number" value={currentBalance} onChange={(event) => setCurrentBalance(event.target.value)} />
        </ScenarioField>
        <ScenarioField label="Customer count">
          <TextInput type="number" value={customerCount} onChange={(event) => setCustomerCount(event.target.value)} />
        </ScenarioField>
        <ScenarioField label="Expected balance growth %" hint="Incremental balance response during campaign">
          <TextInput type="number" step="0.1" value={expectedBalanceGrowth} onChange={(event) => setExpectedBalanceGrowth(event.target.value)} />
        </ScenarioField>
        <ScenarioField label="Expected churn reduction %" hint="Retention benefit from the offer">
          <TextInput type="number" step="0.1" value={expectedChurnReduction} onChange={(event) => setExpectedChurnReduction(event.target.value)} />
        </ScenarioField>
        <ScenarioField label="Cannibalisation %" hint="Share of balances that would have stayed anyway">
          <TextInput type="number" step="0.1" value={cannibalisation} onChange={(event) => setCannibalisation(event.target.value)} />
        </ScenarioField>
        <ScenarioField label="Campaign duration in months">
          <TextInput type="number" value={campaignDuration} onChange={(event) => setCampaignDuration(event.target.value)} />
        </ScenarioField>
        <ScenarioField label="Deposit beta assumption">
          <TextInput type="number" step="0.01" value={depositBeta} onChange={(event) => setDepositBeta(event.target.value)} />
        </ScenarioField>
        <ScenarioField label="Conduct risk level">
          <SelectInput value={conductRisk} onChange={(event) => setConductRisk(event.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </SelectInput>
        </ScenarioField>
        <ScenarioField label="Complexity level">
          <SelectInput value={complexityLevel} onChange={(event) => setComplexityLevel(event.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </SelectInput>
        </ScenarioField>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Current annual interest cost" value={formatCurrency(numeric.currentAnnualInterestCost)} />
        <MetricCard label="Proposed annual interest cost" value={formatCurrency(numeric.proposedAnnualInterestCost)} />
        <MetricCard label="Incremental annual cost" value={formatCurrency(numeric.incrementalAnnualCost)} />
        <MetricCard label="Campaign-period incremental cost" value={formatCurrency(numeric.campaignPeriodIncrementalCost)} />
        <MetricCard label="Estimated acquired balances" value={formatCurrency(numeric.estimatedAcquiredBalances)} />
        <MetricCard label="Estimated retained balances" value={formatCurrency(numeric.estimatedRetainedBalances)} />
        <MetricCard label="Rate gap vs market average" value={formatPercent(numeric.rateGapToMarketAverage)} />
        <MetricCard label="Rate gap vs highest competitor" value={formatPercent(numeric.rateGapToHighestCompetitor)} />
        <MetricCard label="Spread vs RBA cash rate" value={formatPercent(numeric.spreadToRbaCashRate)} />
        <MetricCard
          label="Pressure flags"
          value={`${numeric.competitorPressure} / ${numeric.marginPressure}`}
          hint="Competitor pressure / Margin pressure"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <DataTable
          columns={[
            { key: "name", label: "Scenario", render: (row: (typeof scenarioRows)[number]) => row.name },
            {
              key: "rate",
              label: "Proposed rate",
              render: (row: (typeof scenarioRows)[number]) => formatPercent(row.proposedRate)
            },
            {
              key: "pressure",
              label: "Competitor pressure",
              render: (row: (typeof scenarioRows)[number]) => (
                <Badge tone={row.pressure === "High" ? "danger" : row.pressure === "Medium" ? "warning" : "success"}>
                  {row.pressure}
                </Badge>
              )
            }
          ]}
          rows={scenarioRows}
        />

        <InsightPanel title="Recommendation panel">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">Pricing action</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  {getPricingAction(numeric.competitorPressure, numeric.marginPressure, numeric.incrementalAnnualCost)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">Stakeholders to involve</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Product, Finance, Treasury, Risk and Compliance
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Rationale</p>
              <p className="mt-2 text-sm text-slate-900">{recommendation}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">Risks to validate</p>
                <p className="mt-2 text-sm text-slate-900">
                  Funding cost pressure, conduct clarity, cannibalisation and segment response.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">Metrics to monitor</p>
                <p className="mt-2 text-sm text-slate-900">
                  Balance growth, churn reduction, incremental cost, offer take-up and complaints.
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">Conduct risk</p>
                <p className="mt-2 font-medium text-slate-900">{conductRisk}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">Complexity level</p>
                <p className="mt-2 font-medium text-slate-900">{complexityLevel}</p>
              </div>
            </div>
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Final pricing decisions require Product, Finance, Treasury, Risk and Compliance review.
            </p>
          </div>
        </InsightPanel>
      </section>
    </div>
  );
}

function getPricingAction(
  competitorPressure: "Low" | "Medium" | "High",
  marginPressure: "Low" | "Medium" | "High",
  incrementalAnnualCost: number
) {
  if (competitorPressure === "High" && incrementalAnnualCost > 1500000) {
    return "Targeted offer";
  }
  if (competitorPressure === "High" && marginPressure !== "High") {
    return "Defensive repricing";
  }
  if (marginPressure === "High") {
    return "Simplify proposition";
  }
  if (competitorPressure === "Low") {
    return "Hold";
  }

  return "Monitor";
}

function buildRecommendation(input: {
  competitorPressure: "Low" | "Medium" | "High";
  marginPressure: "Low" | "Medium" | "High";
  rateGapToMarketAverage: number;
  spreadToRbaCashRate: number;
  incrementalAnnualCost: number;
}) {
  const notes: string[] = [];

  if (input.rateGapToMarketAverage < -0.5) {
    notes.push("Competitor pressure is high because the proposed rate sits more than 0.50% below the market average.");
  } else if (input.competitorPressure === "Low") {
    notes.push("Competitor pressure is low, so holding rate and focusing on customer primacy and customer experience is viable.");
  } else {
    notes.push("Competitor pressure is moderate, so monitor retention and test response before broad repricing.");
  }

  if (input.spreadToRbaCashRate > 0.75) {
    notes.push("The proposed rate materially exceeds the RBA cash rate, which flags funding cost pressure.");
  }

  if (input.incrementalAnnualCost > 1500000) {
    notes.push("Broad repricing carries high incremental cost, so prefer a targeted segment-level offer.");
  }

  if (input.marginPressure === "High") {
    notes.push("Margin pressure is elevated and requires tighter Treasury and Finance review.");
  }

  notes.push("Final pricing decisions require Product, Finance, Treasury, Risk and Compliance review.");

  return notes.join(" ");
}
