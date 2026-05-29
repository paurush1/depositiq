import { PrioritisationWorkbench } from "@/components/prioritisation-workbench";
import { PageHeader } from "@/components/ui/page-header";

export default function PrioritisationPage() {
  return (
    <div>
      <PageHeader
        title="Prioritisation"
        description="Adjust decision weights and watch the ranked backlog update live across commercial value, customer value, risk and delivery drag."
      />
      <PrioritisationWorkbench />
    </div>
  );
}
