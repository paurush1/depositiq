import { ProductComplexityWorkbench } from "@/components/product-complexity-workbench";
import { PageHeader } from "@/components/ui/page-header";

export default function ProductComplexityPage() {
  return (
    <div>
      <PageHeader
        title="Product Complexity"
        description="Analyse how tiers, conditions, balance thresholds and product rules affect simplicity and customer comprehension risk."
      />
      <ProductComplexityWorkbench />
    </div>
  );
}
