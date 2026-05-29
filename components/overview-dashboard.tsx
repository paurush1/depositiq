"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { InsightPanel } from "@/components/ui/insight-panel";
import { ModuleCard } from "@/components/ui/module-card";
import { useMarketData } from "@/components/use-market-data";
import { analyseCompetitorRates, getMarketStatusLabel } from "@/lib/depositiq/prototype";

export function OverviewDashboard() {
  const { data, loading } = useMarketData("live");
  const complexityRows = analyseCompetitorRates(data?.competitorRates ?? []);
  const highRiskCount = complexityRows.filter(
    (row) => row.comprehensionRisk === "High"
  ).length;

  const modules = [
    {
      title: "Market Intelligence",
      description:
        "Track public competitor deposit pricing, source status, and rate distribution with search and filters.",
      metric: data
        ? `${data.summary.competitorProductsAnalysed} products scanned across public CDR and fallback sources`
        : "Loading market scan",
      href: "/market-intelligence" as const
    },
    {
      title: "Pricing Simulator",
      description:
        "Model rate, balance, churn and funding-cost trade-offs with editable assumptions and deterministic recommendations.",
      metric: data
        ? `${data.summary.marketAverageRate.toFixed(2)}% current market average headline rate`
        : "Loading pricing context",
      href: "/pricing-simulator" as const
    },
    {
      title: "Product Complexity",
      description:
        "Score conditionality, simplicity and comprehension risk across savings and term deposit products.",
      metric: `${highRiskCount} products currently flagged as high comprehension risk`,
      href: "/product-complexity" as const
    },
    {
      title: "Primary Banking",
      description:
        "Use synthetic behavioural signals to estimate primacy and identify next-best actions.",
      metric: "Live what-if scoring for salary credit, PayID, wallet and card usage",
      href: "/primary-banking" as const
    },
    {
      title: "Customer Friction",
      description:
        "Classify recurring customer pain points across deposits and payments journeys using deterministic rules.",
      metric: "Feedback themes update instantly as new synthetic comments are added",
      href: "/customer-friction" as const
    },
    {
      title: "Prioritisation",
      description:
        "Re-rank initiatives as strategic, commercial and risk weightings change.",
      metric: "Adjustable weightings for commercial value, customer value, risk and delivery drag",
      href: "/prioritisation" as const
    }
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <InsightPanel title="What DepositIQ does">
          DepositIQ gives deposits and payments teams one place to monitor public
          market pricing, test rate scenarios, assess product complexity, understand
          primacy signals, cluster customer friction, and re-rank the roadmap as
          market or risk conditions change.
        </InsightPanel>

        <InsightPanel title="Problems it solves">
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-slate-900">For the bank</p>
              <p>
                It reduces fragmented decision-making across pricing, product, treasury,
                servicing and risk by connecting market movements, margin trade-offs,
                conduct considerations and delivery priorities in one workflow.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">For customers</p>
              <p>
                It highlights where pricing is confusing, where product conditions feel
                too complex, and where stronger primacy or better servicing could improve
                trust, retention and everyday banking experience.
              </p>
            </div>
          </div>
        </InsightPanel>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="RBA cash rate"
          value={loading || !data ? "Loading..." : `${data.cashRate.cashRateTarget.toFixed(2)}%`}
          hint={loading || !data ? "Loading market anchor" : `Effective ${data.cashRate.effectiveDate}`}
        />
        <MetricCard
          label="Market average headline rate"
          value={loading || !data ? "Loading..." : `${data.summary.marketAverageRate.toFixed(2)}%`}
          hint="Average headline rate across analysed products"
        />
        <MetricCard
          label="Highest competitor rate"
          value={loading || !data ? "Loading..." : `${data.summary.highestCompetitorRate.toFixed(2)}%`}
          hint="Highest single public headline rate observed"
        />
        <MetricCard
          label="Competitor products analysed"
          value={loading || !data ? "Loading..." : String(data.summary.competitorProductsAnalysed)}
          hint="Products scanned in current market snapshot"
        />
        <MetricCard
          label="Data source status"
          value={loading || !data ? "Loading..." : getMarketStatusLabel(data.summary.dataSourceStatus)}
          hint="Live CDR, fallback or partial resilience mode"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <InsightPanel title="Product insight panel">
          Deposit pricing should be informed by RBA rate movements, competitor pricing,
          customer behaviour, margin impact and conduct risk.
        </InsightPanel>

        <InsightPanel title="Portfolio positioning">
          Portfolio-grade product prototype using public market data, synthetic
          behavioural data and deterministic decision logic.
        </InsightPanel>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.title} {...module} />
        ))}
      </section>
    </div>
  );
}
