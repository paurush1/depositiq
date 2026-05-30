import { PricingSimulatorWorkbench } from "@/components/pricing-simulator-workbench";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-layout";

export default function PricingSimulatorPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Pricing Simulator"
        description="Model rate decisions with live assumptions for balances, churn, campaign duration, deposit beta and conduct complexity."
        actions={<ButtonLink href="/market-intelligence" tone="secondary">Explore Market Intelligence</ButtonLink>}
      />
      <PricingSimulatorWorkbench />
    </PageContainer>
  );
}
