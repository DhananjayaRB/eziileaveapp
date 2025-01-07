import { NewLeave } from "./new-leave";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  return <NewLeave id={params.id} />;
}
