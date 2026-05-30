import { ProductComplexityWorkbench } from "@/components/product-complexity-workbench";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-layout";

export default function ProductComplexityPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Product Complexity"
        description="Analyse how tiers, conditions, balance thresholds and product rules affect simplicity and customer comprehension risk."
      />
      <ProductComplexityWorkbench />
    </PageContainer>
  );
}
