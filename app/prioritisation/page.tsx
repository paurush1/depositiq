import { PrioritisationWorkbench } from "@/components/prioritisation-workbench";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-layout";

export default function PrioritisationPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Prioritisation"
        description="Adjust decision weights and watch the ranked backlog update live across commercial value, customer value, risk and delivery drag."
      />
      <PrioritisationWorkbench />
    </PageContainer>
  );
}
