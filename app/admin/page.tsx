import { PageHeader } from "@/components/ui/page-header";
import { InsightPanel } from "@/components/ui/insight-panel";

export default function AdminPage() {
  return (
    <div>
      <PageHeader
        title="Data guardrails"
        description="DepositIQ uses public product reference data where available, synthetic customer and feedback data, and server-side fallback logic so the product remains usable when live market calls fail."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <InsightPanel title="Sources in scope">
          RBA cash rate fallback anchor, CDR Register discovery and public CDR Product
          Reference Data for savings and term deposit market comparison.
        </InsightPanel>
        <InsightPanel title="Caveats">
          Competitor rates are indicative and require human review due to tiers, bonus
          conditions, eligibility rules and product terms. No real customer data is used.
        </InsightPanel>
        <InsightPanel title="Fail-safe behaviour">
          Live CDR requests remain server-side only. If external calls fail, fallback data
          and warnings keep the experience available.
        </InsightPanel>
      </div>
    </div>
  );
}
