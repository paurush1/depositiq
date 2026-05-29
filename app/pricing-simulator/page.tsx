import { PricingSimulatorWorkbench } from "@/components/pricing-simulator-workbench";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";

export default function PricingSimulatorPage() {
  return (
    <div>
      <PageHeader
        title="Pricing Simulator"
        description="Model rate decisions with live assumptions for balances, churn, campaign duration, deposit beta and conduct complexity."
        actions={<ButtonLink href="/market-intelligence" tone="secondary">Explore Market Intelligence</ButtonLink>}
      />
      <PricingSimulatorWorkbench />
    </div>
  );
}
