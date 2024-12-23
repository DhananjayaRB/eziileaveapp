import { UpdateRole } from "@/components/role/update-role-main";

interface Props {
  params: {
    id: string;
  };
}

export default function RolePage({ params }: Props) {
  return <UpdateRole id={Number(params.id)} />;
}
