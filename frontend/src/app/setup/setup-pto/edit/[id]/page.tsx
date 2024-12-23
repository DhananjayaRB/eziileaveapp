import { EditPTO } from "./edit-pto";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  return <EditPTO id={params.id} />;
}
