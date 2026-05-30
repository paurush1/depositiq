"use client";

import { ButtonLink } from "@/components/ui/button";
import { InsightPanel } from "@/components/ui/insight-panel";
import { MetricCard } from "@/components/ui/metric-card";
import { MetricGrid, Section, WorkbenchGrid } from "@/components/ui/page-layout";
import { ModuleCard } from "@/components/ui/module-card";
import { useMarketData } from "@/components/use-market-data";
import {
  analyseCompetitorRates,
  baseFeedbackItems,
  defaultPrioritisationWeights,
  getMarketStatusLabel,
  getTopFrictionTheme,
  rankInitiatives
} from "@/lib/depositiq/prototype";

export function OverviewDashboard() {
  const { data, loading } = useMarketData("live");
  const complexityRows = analyseCompetitorRates(data?.competitorRates ?? []);
  const highRiskCount = complexityRows.filter(
    (row) => row.comprehensionRisk === "High"
  ).length;
  const topPriority = rankInitiatives(defaultPrioritisationWeights)[0];
  const topFrictionTheme = getTopFrictionTheme(baseFeedbackItems);

  const modules = [
    {
      title: "Market Intelligence",
      description:
        "Benchmarks competitor deposit products using public product reference data and fallback market data.",
      whyItMatters:
        "Deposit pricing decisions need a live view of market pressure, competitor positioning, headline rate dispersion, product conditions and data-source confidence.",
      keyDecision:
        "Should we hold, reprice, target a segment or simplify the proposition?",
      href: "/market-intelligence" as const
    },
    {
      title: "Pricing Simulator",
      description:
        "Models the financial and strategic impact of deposit rate changes across customer segments, balance assumptions, churn, campaign duration and market pressure.",
      whyItMatters:
        "A rate increase may grow or retain balances, but it can also create funding cost, cannibalisation and margin pressure.",
      keyDecision:
        "Which pricing scenario offers the best trade-off between growth, retention, margin and conduct risk?",
      href: "/pricing-simulator" as const
    },
    {
      title: "Product Complexity",
      description:
        "Scores deposit products for simplicity, conditionality and customer comprehension risk.",
      whyItMatters:
        "The highest headline rate is not always the strongest customer proposition if the product is difficult to understand or qualify for.",
      keyDecision:
        "Which products need simplification, clearer communication or condition redesign?",
      href: "/product-complexity" as const
    },
    {
      title: "Primary Banking",
      description:
        "Scores customer relationship depth using synthetic everyday banking behaviours such as salary credit, card usage, wallet activation, PayID registration, direct debits, recurring payments and app engagement.",
      whyItMatters:
        "Deposits are the balance sheet outcome. Payments behaviour is the relationship signal.",
      keyDecision:
        "Which customer cohorts should receive primacy nudges and next-best actions?",
      href: "/primary-banking" as const
    },
    {
      title: "Customer Friction",
      description:
        "Classifies customer feedback into themes, journey stages, likely owners, severity and recommended actions.",
      whyItMatters:
        "Customer feedback is only useful when it becomes product action.",
      keyDecision:
        "Which friction points should Product, Operations, Technology, Risk or Marketing fix first?",
      href: "/customer-friction" as const
    },
    {
      title: "Prioritisation",
      description:
        "Ranks product initiatives using commercial value, customer value, risk reduction, market pressure, primacy uplift, effort and dependency complexity.",
      whyItMatters:
        "Product teams need transparent trade-offs instead of prioritising based only on noise, politics or stakeholder volume.",
      keyDecision:
        "Which initiatives should move into discovery, delivery or governance review next?",
      href: "/prioritisation" as const
    }
  ];

  return (
    <div className="space-y-10">
      <Section>
        <WorkbenchGrid>
          <InsightPanel title="What DepositIQ does">
            DepositIQ gives deposits and payments teams one place to benchmark market
            pricing, model product economics, interpret customer signals, and convert
            those inputs into clearer product and pricing decisions.
          </InsightPanel>

          <InsightPanel title="Who it helps and why it matters">
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900">For the bank</p>
                <p>
                  It reduces fragmented decision-making across Product, Pricing, Treasury,
                  Risk, Operations and Customer teams by connecting market rates, customer
                  behaviour, complexity and roadmap trade-offs in one operating rhythm.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">For customers</p>
                <p>
                  It highlights where product conditions are hard to understand, where
                  servicing pain points accumulate, and where the bank can improve trust,
                  clarity and everyday relationship value beyond the headline rate alone.
                </p>
              </div>
            </div>
          </InsightPanel>
        </WorkbenchGrid>
      </Section>

      <Section>
        <MetricGrid className="xl:grid-cols-3 2xl:grid-cols-6">
          <MetricCard
            label="RBA cash rate"
            value={`${data?.cashRate.cashRateTarget.toFixed(2) ?? "4.35"}%`}
            hint={`Effective ${data?.cashRate.effectiveDate ?? "2026-05-06"}`}
          />
          <MetricCard
            label="Market average headline rate"
            value={`${data?.summary.marketAverageRate.toFixed(2) ?? "0.00"}%`}
            hint="Average headline rate across analysed products"
          />
          <MetricCard
            label="Highest competitor rate"
            value={`${data?.summary.highestCompetitorRate.toFixed(2) ?? "0.00"}%`}
            hint="Highest single public headline rate observed"
          />
          <MetricCard
            label="Competitor products analysed"
            value={String(data?.summary.competitorProductsAnalysed ?? 0)}
            hint="Products scanned in current market snapshot"
          />
          <MetricCard
            label="Top customer friction theme"
            value={topFrictionTheme}
            hint="Most severe recurring friction theme in the current feedback set"
          />
          <MetricCard
            label="Top roadmap priority"
            value={topPriority.name}
            hint={
              loading || !data
                ? "Using fallback product context while live data loads"
                : `Data source: ${getMarketStatusLabel(data.summary.dataSourceStatus)}`
            }
            badge={highRiskCount > 0 ? `${highRiskCount} high-risk products` : undefined}
          />
        </MetricGrid>
      </Section>

      <Section>
        <WorkbenchGrid>
          <InsightPanel title="Product thesis">
            Deposit pricing should not be managed as a rate table. It should connect
            market rates, RBA context, customer behaviour, margin impact, product
            complexity and conduct risk.
          </InsightPanel>

          <InsightPanel title="Methodology preview">
            <p>
              Understand the data sources, scoring models, caveats and governance logic
              behind DepositIQ.
            </p>
            <div className="mt-5">
              <ButtonLink href="/methodology" tone="secondary">
                View methodology
              </ButtonLink>
            </div>
          </InsightPanel>
        </WorkbenchGrid>
      </Section>

      <Section>
        <InsightPanel title="How DepositIQ works">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <p className="font-semibold text-slate-900">1. Ingest market signals</p>
              <p className="mt-2">
                Public CDR product reference data, RBA rate context and fallback benchmark data.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">2. Interpret product economics</p>
              <p className="mt-2">
                Pricing scenarios, rate gaps, margin pressure and funding-cost implications.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">3. Read customer signals</p>
              <p className="mt-2">
                Primacy behaviour, customer friction and product comprehension risk.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">4. Prioritise product action</p>
              <p className="mt-2">
                Ranked roadmap initiatives with adjustable commercial, customer and risk weightings.
              </p>
            </div>
          </div>
        </InsightPanel>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>
      </Section>
    </div>
  );
}
