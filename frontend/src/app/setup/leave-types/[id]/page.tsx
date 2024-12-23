import { Main } from "./main";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  return <Main id={params.id} />;
}
