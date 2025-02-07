"use client";

import * as FadeIn from "@/components/animation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Workflow } from "@/lib/types";
import { Flex, Input, Select, Text, useDisclosure } from "@chakra-ui/react";
import { Button } from "../core/button";
import { Timeline, TimelineEvent } from "../core/timeline";
import WarningModal from "../modal/warning";
import { Calendar } from "../ui/calendar";
import { workflowOptions } from "@/data/workflow-options";

interface Props {
  setData: (value: React.SetStateAction<Workflow>) => void;
  data: Workflow;
  onSubmit: () => void;
  onDiscard: () => void;
  isLoading: boolean;
}

export function WorkflowForm({
  setData,
  data,
  onSubmit,
  onDiscard,
  isLoading,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDiscard = () => {
    onOpen();
  };

  const subProcessOptions = workflowOptions[data.process] || [];

  return (
    <>
      <FadeIn.Item>
        <div className="p-4 md:px-6 md:py-8 flex flex-col md:flex-col items-start justify-between bg-white md:p-5 mt-6 rounded-lg space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:items-center w-full">
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <Text
                color="#383838"
                fontWeight={700}
                fontSize={{ base: 16, md: 16 }}
              >
                Workflow Name
              </Text>

              <Input
                placeholder="eg. Leave Approval for Factory Employees"
                width={{ base: "100%", md: "80%" }}
                value={data.name}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                _focus={{ borderColor: "#08705C" }}
                _focusVisible={{
                  outline: "none",
                }}
              />
            </div>

            <div className="flex flex-col space-y-2  w-full md:w-1/3">
              <Text
                color="#383838"
                fontWeight={700}
                fontSize={{ base: 16, md: 16 }}
              >
                Effective Date
              </Text>

              <Popover>
                <PopoverTrigger asChild>
                  <Input
                    placeholder="eg. 01/01/2025"
                    width={{ base: "100%", md: "80%" }}
                    value={
                      data.effectiveDate
                        ? new Date(data.effectiveDate).toLocaleDateString()
                        : ""
                    }
                    _focus={{ borderColor: "#08705C" }}
                    _focusVisible={{
                      outline: "none",
                    }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      data.effectiveDate
                        ? new Date(data.effectiveDate)
                        : undefined
                    }
                    onSelect={(value: Date | undefined) =>
                      setData((prev) => ({
                        ...prev,
                        effectiveDate: value?.toISOString() || "",
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:items-center w-full">
            <div className="flex flex-col space-y-2 w-full md:w-1/3">
              <Text
                color="#383838"
                fontWeight={700}
                fontSize={{ base: 16, md: 16 }}
              >
                Select Process
              </Text>

              <Select
                placeholder="Select Process"
                width={{ base: "100%", md: "80%" }}
                value={data.process}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    process: e.target.value,
                  }))
                }
              >
                {Object.keys(workflowOptions).map((key) => (
                   <option key={key} value={key}>{key}</option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col space-y-2  w-full md:w-1/3">
              <Text
                color="#383838"
                fontWeight={700}
                fontSize={{ base: 16, md: 16 }}
              >
                Select sub-process
              </Text>

              <Select
                placeholder="Select sub-process"
                width={{ base: "100%", md: "80%" }}
                value={data.subProcess}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    subProcess: e.target.value,
                  }))
                }
              >
                {subProcessOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="p-4 md:px-6 md:py-8 flex flex-col md:flex-col items-start justify-between md:p-5 mt-6 rounded-lg md:space-y-6">
          <Flex direction={{ base: "column", md: "row" }} w="100%" gap={5}>
            <Text
              color="#383838"
              fontWeight={700}
              fontSize={{ base: 18, md: 20 }}
            >
              Review Steps
            </Text>
            <Flex
              direction="row"
              w={{ base: "100%", md: "20%" }}
              justify={{ base: "flex-start", md: "flex-end" }}
              alignItems="center"
            ></Flex>
          </Flex>

          <div className="w-[95%] md:w-[80%]">
            <Timeline>
              <TimelineEvent
                index={0}
                title={data.name}
                totalSteps={data.steps.length + 1}
              />
              {data.steps.map((step, index) => (
                <TimelineEvent
                  key={index}
                  index={index + 1}
                  title=""
                  totalSteps={data.steps.length + 1}
                  step={step}
                  stepCount={data.steps.length}
                  onStepChange={(stepId, updatedStep) => {
                    setData((prev) => ({
                      ...prev,
                      steps: prev.steps.map((s) =>
                        s.id === stepId ? updatedStep : s
                      ),
                    }));
                  }}
                  onDeleteStep={(stepId) => {
                    setData((prev) => ({
                      ...prev,
                      steps: prev.steps.filter((s) => s.id !== stepId),
                    }));
                  }}
                  onAddStep={() => {
                    setData((prev) => ({
                      ...prev,
                      steps: [
                        ...prev.steps.map((step) => ({
                          ...step,
                          autoApproval: false,
                        })),
                        {
                          id: prev.steps.length + 1,
                          name: "",
                          forwardToNext: false,
                          forwardAfter: {
                            days: "",
                            hours: "",
                          },
                          assignedRoles: [],
                          autoApproval: false,
                        },
                      ],
                    }));
                  }}
                />
              ))}
            </Timeline>
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          w="100%"
          bg="white"
          p={5}
          gap={{ base: 2, md: 4 }}
          borderRadius={10}
        >
          <Button px={4} py={4} variant="outline" onClick={handleDiscard}>
            Discard
          </Button>
          <Button px={4} py={4} onClick={onSubmit} isLoading={isLoading}>
            Create Workflow
          </Button>
        </Flex>
      </FadeIn.Item>

      <WarningModal
        isOpen={isOpen}
        onClose={onClose}
        heading="Discard Changes"
        description="Are you sure you want to discard all changes?"
        onConfirm={onDiscard}
      />
    </>
  );
}
