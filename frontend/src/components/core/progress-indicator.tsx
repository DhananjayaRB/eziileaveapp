import { cn } from "@/lib/utils";
import { Text } from "@chakra-ui/react";
import { CheckIcon } from "lucide-react";

export const ProgressCircle = ({
  number,
  active,
  activeStep,
}: {
  number: number;
  active: boolean;
  activeStep: number;
}) => (
  <div
    className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center border-2",
      active
        ? `border-[#0B7B69] text-[#0B7B69]`
        : number < activeStep
        ? `border-[#0B7B69] text-[#0B7B69] bg-[#0B7B69]`
        : `border-[#CCCDCE] text-[#9A9B9D]`
    )}
  >
    {number < activeStep ? (
      <CheckIcon className="h-5 w-5 rounded-full text-[#FAFAFA]" />
    ) : (
      <Text fontWeight={500}>{number}</Text>
    )}
  </div>
);

export const ProgressLine = () => (
  <div className={cn(`w-4 h-[1px] bg-[#CCCDCE]`)} />
);
