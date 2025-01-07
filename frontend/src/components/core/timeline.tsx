import {
  Badge,
  Checkbox,
  Flex,
  Icon,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { Button } from "./button";
import { FaEdit, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import RolesModal from "../modal/roles";

interface TimelineProps {
  children: ReactNode;
}

interface TimelineEventProps {
  title: string;
  index: number;
  totalSteps: number;
  step?: WorkflowStep;
  onStepChange?: (stepId: number, updatedStep: WorkflowStep) => void;
  onAddStep?: () => void;
  onDeleteStep?: (stepId: number) => void;
  stepCount?: number;
}

const TimelineMarker = ({ label }: { label: string }) => (
  <Text
    fontSize={{ base: 14, md: 16 }}
    fontWeight={700}
    className="text-[#08705C] my-2"
  >
    {label}
  </Text>
);

interface WorkflowStep {
  id: number;
  name: string;
  forwardToNext: boolean;
  forwardAfter: {
    days: string;
    hours: string;
  };
  assignedRoles: { id: number; name: string }[];
  autoApproval?: boolean;
}

interface TimeLineCardProps {
  totalSteps: number;
  index: number;
  step: WorkflowStep;
  onStepChange: (stepId: number, updatedStep: WorkflowStep) => void;
  onAddStep: () => void;
  onDeleteStep: (stepId: number) => void;
  stepCount: number;
}

function TimeLineCard({
  totalSteps,
  index,
  step,
  onStepChange,
  onAddStep,
  onDeleteStep,
  stepCount,
}: TimeLineCardProps) {
  const {
    isOpen: isRolesOpen,
    onOpen: onRolesOpen,
    onClose: onRolesClose,
  } = useDisclosure();

  const handleForwardToNextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onStepChange(step.id, {
      ...step,
      forwardToNext: e.target.checked,
    });
  };

  const handleForwardAfterChange = (field: "days" | "hours", value: string) => {
    onStepChange(step.id, {
      ...step,
      forwardAfter: {
        ...step.forwardAfter,
        [field]: value,
      },
    });
  };

  const handleAssignRoles = (roles: { id: number; name: string }[]) => {
    onStepChange(step.id, {
      ...step,
      assignedRoles: roles,
    });
    onRolesClose();
  };

  return (
    <>
      <Flex
        bg="white"
        p={3}
        border="1px solid #E6E6E7"
        borderRadius={10}
        w={{ base: "100%", md: "50%" }}
        minHeight="50px"
        direction="column"
      >
        <Flex direction="row" align="center" justify="space-between">
          <Text
            color="#333333"
            fontWeight={700}
            fontSize={{ base: "16px", md: "20px" }}
          >
            Review {index}
          </Text>
          {stepCount > 1 && (
            <Icon
              as={FaTrash}
              fontSize={16}
              color="#EDA145"
              cursor="pointer"
              onClick={() => onDeleteStep(step.id)}
            />
          )}
        </Flex>

        <div className="flex flex-col space-y-2 mt-4">
          <Text
            color="#383838"
            fontWeight={700}
            fontSize={{ base: 12, md: 14 }}
          >
            Title
          </Text>
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <Input
              placeholder="eg. Leave Approval for Factory Employees"
              width={{ base: "100%", md: "80%" }}
              value={step.name}
              onChange={(e) =>
                onStepChange(step.id, {
                  ...step,
                  name: e.target.value,
                })
              }
              _focus={{ borderColor: "#08705C" }}
              _focusVisible={{
                outline: "none",
              }}
            />
            {step.assignedRoles.length === 0 && (
              <Button
                variant="outline"
                w={{ base: "100%", md: "auto" }}
                onClick={onRolesOpen}
              >
                Assign Roles
              </Button>
            )}
          </div>
          {step.assignedRoles.length > 0 && (
            <Flex
              direction="row"
              align="center"
              gap={2}
              justify="space-between"
              mt={2}
            >
              {step.assignedRoles.length > 0 && (
                <Flex direction="row" align="center" gap={2}>
                  <Text fontSize={{ base: 12, md: 14 }}>
                    Assigned to ({step.assignedRoles.length}) Roles
                  </Text>
                  {step.assignedRoles.map((role, index) => (
                    <Flex
                      direction={{ base: "column", md: "row" }}
                      align="center"
                      gap={2}
                    >
                      <Badge
                        key={index}
                        border="1px solid #CCCDCE"
                        bg="#FFFFFF"
                        px={3}
                        py={0.75}
                        borderRadius={8}
                        textTransform="capitalize"
                        color="#676A6C"
                        fontWeight={500}
                        fontSize={{ base: 12, md: 14 }}
                      >
                        {role.name}
                      </Badge>
                    </Flex>
                  ))}
                </Flex>
              )}

              <Flex
                direction="row"
                align="center"
                gap={2}
                cursor="pointer"
                color="#08705C"
                fontWeight={700}
                fontSize={{ base: 12, md: 14 }}
                onClick={onRolesOpen}
              >
                <Icon as={FaPencilAlt} fontSize={16} />
                Edit
              </Flex>
            </Flex>
          )}

          {index === totalSteps - 1 && (
            <div className="w-full flex flex-row items-center justify-between">
              <Text color="#383838" fontSize={{ base: 12, md: 14 }}>
                Auto Approval
              </Text>

              <Checkbox
                isChecked={step.autoApproval}
                onChange={(e) => {
                  if (e.target.checked) {
                    onStepChange(step.id, {
                      ...step,
                      autoApproval: true,
                    });
                  } else {
                    onStepChange(step.id, {
                      ...step,
                      autoApproval: false,
                    });
                  }
                }}
                sx={{
                  "& .chakra-checkbox__control": {
                    borderColor: "#08705C",
                    _checked: {
                      bg: "#08705C",
                      borderColor: "#08705C",
                      color: "white",
                    },
                  },
                }}
              />
            </div>
          )}

          {index !== totalSteps - 1 && (
            <div className="w-full flex flex-row items-center justify-between">
              <Text color="#383838" fontSize={{ base: 12, md: 14 }}>
                Forward to the next review
              </Text>

              <Checkbox
                isChecked={step.forwardToNext}
                onChange={handleForwardToNextChange}
                sx={{
                  "& .chakra-checkbox__control": {
                    borderColor: "#08705C",
                    _checked: {
                      bg: "#08705C",
                      borderColor: "#08705C",
                      color: "white",
                    },
                  },
                }}
              />
            </div>
          )}

          {step.forwardToNext && (
            <div className="w-full flex flex-col items-start justify-between md:flex-row md:items-center">
              <Text
                color="#383838"
                fontSize={{ base: 12, md: 14 }}
                mb={{ base: 4, md: 0 }}
                w={{ base: "100%", md: "40%" }}
              >
                Forward after
              </Text>

              <div className="flex flex-col md:flex-row items-start md:items-center md:w-[60%] md:justify-end">
                <div className="flex items-center border bg-white px-3 rounded-xl">
                  <Input
                    type="number"
                    value={step.forwardAfter.days}
                    onChange={(e) =>
                      handleForwardAfterChange("days", e.target.value)
                    }
                    w={{ base: "100%", md: "75px" }}
                    border="none"
                    _focus={{ borderColor: "transparent" }}
                    _focusVisible={{
                      outline: "none",
                    }}
                  />
                  <Text fontSize={{ base: 14, md: 16 }} color="#9A9B9D">
                    (days)
                  </Text>
                </div>
                <div className="flex items-center border bg-white px-3 rounded-xl">
                  <Input
                    type="number"
                    value={step.forwardAfter.hours}
                    onChange={(e) =>
                      handleForwardAfterChange("hours", e.target.value)
                    }
                    w={{ base: "100%", md: "75px" }}
                    border="none"
                    _focus={{ borderColor: "transparent" }}
                    _focusVisible={{
                      outline: "none",
                    }}
                  />
                  <Text fontSize={{ base: 14, md: 16 }} color="#9A9B9D">
                    (hours)
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </Flex>

      {index === totalSteps - 1 && (
        <Button
          variant="outline"
          w={{ base: "100%", md: "auto" }}
          mt={4}
          icon={FaPlus}
          onClick={onAddStep}
        >
          Add Review Step
        </Button>
      )}

      <RolesModal
        isOpen={isRolesOpen}
        onClose={onRolesClose}
        onConfirm={handleAssignRoles}
        assignedTo={step.assignedRoles}
      />
    </>
  );
}

function TimeLineHeader({ title }: { title: string }) {
  return (
    <Flex
      bg="white"
      p={3}
      border="1px solid #E6E6E7"
      borderRadius={10}
      w={{ base: "100%", md: "50%" }}
      minHeight="50px"
    >
      <Text
        color="#333333"
        fontWeight={700}
        fontSize={{ base: "16px", md: "20px" }}
      >
        {title === "" ? "Workflow Name" : title}
      </Text>
    </Flex>
  );
}

export function TimelineEvent({
  title,
  index,
  totalSteps,
  step,
  onStepChange,
  onAddStep,
  onDeleteStep,
  stepCount,
}: TimelineEventProps) {
  return (
    <li className="mb-10 ms-4 md:ms-16 last:mb-0 w-full">
      <div
        className={`absolute w-3 h-3 ${
          index === 0 ? "bg-[#08705C]" : "bg-[#CCCDCE]"
        } rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900`}
      />

      {index === 0 ? (
        <TimeLineHeader title={title} />
      ) : (
        <>
          <TimeLineCard
            totalSteps={totalSteps}
            index={index}
            step={step!}
            onStepChange={onStepChange!}
            onAddStep={onAddStep!}
            onDeleteStep={onDeleteStep!}
            stepCount={stepCount!}
          />
        </>
      )}
    </li>
  );
}

export function Timeline({ children }: TimelineProps) {
  return (
    <>
      <TimelineMarker label="Start" />
      <ol className="relative border-s border-[#CCCDCE] ml-4">{children}</ol>
      <TimelineMarker label="Finish" />
    </>
  );
}
