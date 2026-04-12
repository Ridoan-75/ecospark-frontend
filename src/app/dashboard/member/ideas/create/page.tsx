import IdeaForm from "@/components/idea/IdeaForm";
import PageHeader from "@/components/shared/PageHeader";
import { Lightbulb } from "lucide-react";

export const metadata = { title: "Create Idea" };

export default function CreateIdeaPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <PageHeader
        icon={Lightbulb}
        title="Create New Idea"
        description="Share your sustainability idea with the community"
      />
      <div className="glass gradient-border rounded-2xl p-6">
        <IdeaForm mode="create" />
      </div>
    </div>
  );
}