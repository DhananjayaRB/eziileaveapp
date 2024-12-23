import { EditCompOff } from "./edit-comp-off";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  return <EditCompOff id={params.id} />;
}
