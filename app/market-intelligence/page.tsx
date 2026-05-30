import { MarketIntelligenceWorkbench } from "@/components/market-intelligence-workbench";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-layout";

export default function MarketIntelligencePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Market Intelligence"
        description="Monitor public competitor deposit pricing, compare savings and term deposit products, and keep a live view of market rate context with fallback resilience."
        actions={<ButtonLink href="/pricing-simulator">Open Pricing Simulator</ButtonLink>}
      />
      <MarketIntelligenceWorkbench />
    </PageContainer>
  );
}
