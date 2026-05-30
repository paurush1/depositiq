import { PrimaryBankingWorkbench } from "@/components/primary-banking-workbench";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-layout";

export default function PrimaryBankingPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Primary Banking"
        description="Estimate synthetic primary banking strength, surface next-best actions and test how primacy levers move the score."
      />
      <PrimaryBankingWorkbench />
    </PageContainer>
  );
}
