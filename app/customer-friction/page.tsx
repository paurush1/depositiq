import { CustomerFrictionWorkbench } from "@/components/customer-friction-workbench";
import { PageHeader } from "@/components/ui/page-header";

export default function CustomerFrictionPage() {
  return (
    <div>
      <PageHeader
        title="Customer Friction"
        description="Classify synthetic customer pain points across deposits and payments journeys, monitor severity, and align action owners."
      />
      <CustomerFrictionWorkbench />
    </div>
  );
}
