import { Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";

interface Props {
  mode: string;
  link: string;
}

export function ApplyButton({ link, mode }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white h-16 md:h-20 w-full border border-[#08705C] rounded-lg flex items-center justify-between px-5 hover:shadow-lg transition-all duration-300"
    >
      <Link
        href={link}
        className="flex flex-row items-center justify-between w-full"
      >
        <Text
          fontWeight={600}
          color="#08705C"
          fontSize={{ base: "14px", md: "16px", lg: "18px" }}
        >
          Apply for {mode}
        </Text>

        <Icon
          as={MdOutlineArrowOutward}
          color="#08705C"
          transform={isHovered ? "translateY(-5px)" : "translateY(0)"}
          transition="transform 0.3s ease-in-out"
          fontSize={{ base: "20px", md: "24px", lg: "28px" }}
        />
      </Link>
    </div>
  );
}
