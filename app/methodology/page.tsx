import { InsightPanel } from "@/components/ui/insight-panel";
import { PageHeader } from "@/components/ui/page-header";

export default function MethodologyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Methodology"
        description="How DepositIQ frames product, pricing and customer decisions using public market reference data, synthetic behavioural data and deterministic scoring logic."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <InsightPanel title="1. Product thesis">
          DepositIQ connects market signals, product economics, customer behaviour
          and roadmap prioritisation into one product operating rhythm for deposits
          and payments teams.
        </InsightPanel>

        <InsightPanel title="2. Target users">
          <ul className="space-y-2">
            <li>Deposit product managers</li>
            <li>Payments product managers</li>
            <li>Pricing teams</li>
            <li>Treasury and funding teams</li>
            <li>Digital banking teams</li>
            <li>Customer experience teams</li>
            <li>Risk and compliance partners</li>
          </ul>
        </InsightPanel>

        <InsightPanel title="3. Data sources">
          DepositIQ uses public product reference data where available, RBA cash
          rate context, fallback benchmark data, and synthetic customer and feedback datasets.
        </InsightPanel>

        <InsightPanel title="4. Why CDR Product Reference Data matters">
          Public CDR Product Reference Data can help compare product features, rates,
          fees and eligibility without accessing customer data.
        </InsightPanel>

        <InsightPanel title="5. Scoring models">
          <ul className="space-y-2">
            <li>Rate competitiveness score</li>
            <li>Product simplicity score</li>
            <li>Product conditionality score</li>
            <li>Primary banking score</li>
            <li>Friction severity score</li>
            <li>Prioritisation score</li>
          </ul>
        </InsightPanel>

        <InsightPanel title="6. Decision governance">
          Final product decisions should involve Product, Finance, Treasury, Risk,
          Compliance, Technology and Operations.
        </InsightPanel>

        <InsightPanel title="7. Caveats and limitations">
          Deposit products can include tiers, introductory rates, bonus conditions,
          eligibility rules and special conditions. All outputs are indicative and
          require human review.
        </InsightPanel>

        <InsightPanel title="8. Future roadmap">
          <ul className="space-y-2">
            <li>Historical rate tracking</li>
            <li>Rate movement alerts</li>
            <li>CSV upload for customer behaviour</li>
            <li>CSV upload for complaints and feedback</li>
            <li>AI-generated product committee memo</li>
            <li>Segment-level elasticity modelling</li>
            <li>Term deposit maturity analytics</li>
            <li>Governance workflow and audit trail</li>
            <li>Vendor resilience module</li>
            <li>Exportable pricing committee pack</li>
          </ul>
        </InsightPanel>
      </div>
    </div>
  );
}
