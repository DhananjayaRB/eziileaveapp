import { Flex } from "@chakra-ui/react";
import { XIcon } from "lucide-react";

interface Props {
  text: string;
  onRemove?: () => void;
}

export function Badge({ text, onRemove }: Props) {
  return (
    <Flex
      bg="#08705C1F"
      px={4}
      py={2}
      rounded="full"
      color="#08705C"
      border="1px solid #08705C33"
      alignItems="center"
      justifyContent="space-between"
      gap={3}
    >
      <p>{text}</p>
      <XIcon onClick={onRemove} className="cursor-pointer" />
    </Flex>
  );
}
