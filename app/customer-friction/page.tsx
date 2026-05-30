import { CustomerFrictionWorkbench } from "@/components/customer-friction-workbench";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-layout";

export default function CustomerFrictionPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Customer Friction"
        description="Classify synthetic customer pain points across deposits and payments journeys, monitor severity, and align action owners."
      />
      <CustomerFrictionWorkbench />
    </PageContainer>
  );
}
