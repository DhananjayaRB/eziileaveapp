import { EditLeave } from "./edit-leave";

interface Props {
  params: {
    id: string;
    variantId: string;
  };
}

export default function Page({ params }: Props) {
  return <EditLeave id={params.id} variantId={params.variantId} />;
}
