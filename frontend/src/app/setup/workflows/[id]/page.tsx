import { UpdateWorkflow } from "@/components/workflows/update-workflow-main";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  return <UpdateWorkflow id={params.id} />;
}
