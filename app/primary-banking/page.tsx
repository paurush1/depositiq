import { PrimaryBankingWorkbench } from "@/components/primary-banking-workbench";
import { PageHeader } from "@/components/ui/page-header";

export default function PrimaryBankingPage() {
  return (
    <div>
      <PageHeader
        title="Primary Banking"
        description="Estimate synthetic primary banking strength, surface next-best actions and test how primacy levers move the score."
      />
      <PrimaryBankingWorkbench />
    </div>
  );
}
