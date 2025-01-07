import { Setting } from "@/atoms/settings-atom";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { FiCheck } from "react-icons/fi";
import { LiaHomeSolid } from "react-icons/lia";

export interface Step {
  id: number;
  label: string;
  link?: string;
  icon?: IconType | LucideIcon;
}

export function returnAdminSetupSteps(setting: Setting): Step[] {
  return [
    { id: 1, label: "Effective Date", link: "/setup/effective-date" },
    { id: 2, label: "Leave Types", link: "/setup/leave-types" },
    ...(setting.compOff.isEnabled
      ? [{ id: 3, label: "Comp off", link: "/setup/setup-comp-off" }]
      : [{ id: 3, label: "Comp off", link: "/setup/comp-off" }]),
    ...(setting.pto.isEnabled
      ? [{ id: 4, label: "PTO", link: "/setup/setup-pto" }]
      : [{ id: 4, label: "PTO", link: "/setup/pto" }]),
    { id: 5, label: "Roles", link: "/setup/roles" },
    { id: 6, label: "Workflow", link: "/setup/workflows" },
    { id: 7, label: "Combos + Balance", link: "" },
    { id: 8, label: "Leave Planning", link: "" },
  ];
}

export function returnEmployeeSetupSteps(setting: Setting): Step[] {
  return [
    { id: 1, label: "Overview", link: "/", icon: LiaHomeSolid },
    {
      id: 2,
      label: "Leave Applications",
      link: "/leave-applications",
      icon: LiaHomeSolid,
    },
    { id: 3, label: "Holidays", link: "/holidays", icon: LiaHomeSolid },
    ...(setting.compOff.isEnabled
      ? [
          {
            id: 4,
            label: "Compensatory Off",
            link: "/compensatory-off",
            icon: LiaHomeSolid,
          },
        ]
      : []),
    ...(setting.pto.isEnabled
      ? [
          {
            id: 5,
            label: "PTO",
            link: "/pto",
            icon: LiaHomeSolid,
          },
        ]
      : []),
  ];
}

export const SetupStepItem = ({
  steps,
  step,
  isCompleted,
  isActive,
  onClick,
}: {
  steps: Step[];
  step: Step;
  isCompleted: boolean;
  isActive: boolean;
  onClick: (id: number) => void;
}) => {
  return (
    <Flex align="center" width="full" position="relative">
      {step.id !== steps.length && (
        <Box
          position="absolute"
          left="24px"
          top="24px"
          bottom="-24px"
          p={1}
          zIndex="0"
          borderLeft="1.5px dashed #E6E6E7"
          // width="0px"
        />
      )}

      <Flex
        align="center"
        gap="1"
        width="full"
        position="relative"
        zIndex="1"
        bg={isActive ? "#08705C1F" : "transparent"}
        _hover={{
          bg: "#F0FDF4",
        }}
        rounded="md"
        cursor="pointer"
        onClick={() => onClick(step.id)}
        p={2}
      >
        <Flex
          align="center"
          justify="center"
          width="8"
          height="8"
          p={3}
          rounded="full"
          border="1px solid"
          borderColor={
            isActive ? "#08705C" : isCompleted ? "#0F766E" : "#94A3B8"
          }
          bg={isActive ? "#F0FDF4" : isCompleted ? "#0F766E" : "white"}
        >
          {isCompleted ? (
            <Icon as={FiCheck} color="white" />
          ) : (
            <Text
              fontSize="sm"
              fontWeight="700"
              color={isActive ? "#0F766E" : "#94A3B8"}
            >
              {step.id}
            </Text>
          )}
        </Flex>

        <Box p="2" rounded="md" width="full">
          <Text
            fontSize="sm"
            color={isActive ? "#0F766E" : isCompleted ? "#0F1216" : "#64748B"}
            fontWeight={isActive ? "700" : "500"}
          >
            {step.label}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export const StepItem = ({
  step,
  isActive,
  onClick,
}: {
  step: Step;
  isActive: boolean;
  onClick: (id: number) => void;
}) => {
  return (
    <Flex align="center" width="full" position="relative">
      <Flex
        align="center"
        gap="1"
        width="full"
        position="relative"
        zIndex="1"
        bg={isActive ? "#08705C1F" : "transparent"}
        _hover={{
          bg: "#F0FDF4",
        }}
        rounded="md"
        cursor="pointer"
        onClick={() => onClick(step.id)}
        p={2}
      >
        <Flex align="center" justify="center" width="8" height="8" p={3}>
          <Icon
            as={step.icon}
            fontSize="20px"
            color={isActive ? "#0F766E" : "#35383B"}
            fontWeight={700}
          />
        </Flex>

        <Box p="2" rounded="md" width="full">
          <Text
            fontSize="sm"
            color={isActive ? "#0F766E" : "#35383B"}
            fontWeight={isActive ? "700" : "500"}
          >
            {step.label}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};
