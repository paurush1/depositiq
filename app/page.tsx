import { OverviewDashboard } from "@/components/overview-dashboard";
import { ButtonLink } from "@/components/ui/button";
import { productModules } from "@/lib/depositiq/prototype";

export default function HomePage() {
  const heroModules = productModules.filter((module) => module.href !== "/");

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#0b3b63_45%,#dceffd_100%)] shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <div className="px-6 py-8 lg:px-10 lg:py-10">
          <div className="mb-8 flex flex-wrap gap-3">
            {heroModules.map((module) => (
              <ButtonLink
                key={module.href}
                href={module.href}
                tone="ghost"
                className="border border-white/15 bg-white/10 text-white hover:bg-white/18 hover:text-white"
              >
                {module.label}
              </ButtonLink>
            ))}
          </div>

          <div className="max-w-5xl">
            <p className="text-sm font-semibold text-sky-200">DepositIQ</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Market intelligence and product decisioning for deposits and payments teams.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-sky-50/90">
              DepositIQ helps banking product teams connect RBA rate context,
              competitor deposit pricing, product complexity, customer primacy
              signals, customer friction and roadmap prioritisation into one
              decisioning cockpit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/pricing-simulator">Open Pricing Simulator</ButtonLink>
              <ButtonLink href="/market-intelligence" tone="secondary">
                Explore Market Intelligence
              </ButtonLink>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
              <p className="text-sm text-sky-100">Market context</p>
              <p className="mt-3 text-3xl font-semibold">RBA + CDR</p>
              <p className="mt-2 text-sm leading-6 text-sky-50/80">
                Public market signals with fallback resilience if live data is unavailable.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
              <p className="text-sm text-sky-100">Interactive modules</p>
              <p className="mt-3 text-3xl font-semibold">6</p>
              <p className="mt-2 text-sm leading-6 text-sky-50/80">
                Pricing, complexity, primacy, friction and prioritisation work together.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
              <p className="text-sm text-sky-100">Data approach</p>
              <p className="mt-3 text-3xl font-semibold">Deterministic</p>
              <p className="mt-2 text-sm leading-6 text-sky-50/80">
                Public market data, synthetic behaviour and rule-based scoring in one workflow.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
              <p className="text-sm text-sky-100">Governance</p>
              <p className="mt-3 text-3xl font-semibold">Human review</p>
              <p className="mt-2 text-sm leading-6 text-sky-50/80">
                Product, Finance, Treasury, Risk and Compliance remain final decision-makers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <OverviewDashboard />
    </div>
  );
}
