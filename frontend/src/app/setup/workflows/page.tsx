"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import {
  ProgressCircle,
  ProgressLine,
} from "@/components/core/progress-indicator";
import { WorkflowVariants } from "@/components/workflows/variants";
import { Workflow } from "@/lib/types";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";

const fetcher = (url: string) => {
  const tokens = localStorage.getItem("resolve-tokens");
  if (!tokens) return;

  const { token } = JSON.parse(tokens);

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};

export default function Page() {
  const [activeStep, setActiveStep] = useRecoilState(setupStepState);
  const [_, setBreadcrumb] = useRecoilState(breadcrumbState);
  const {
    data: workflowData,
    error,
    isLoading: workflowIsLoading,
  } = useSWR("/api/workflow", fetcher);
  const [workflows, setWorkflows] = React.useState<Workflow[]>([]);

  useEffect(() => {
    if (workflowData) setWorkflows(workflowData as Workflow[]);
  }, [workflowData]);

  const router = useRouter();

  const updateBreadcrumb = useCallback(() => {
    setBreadcrumb((prev) => [
      { name: "Leave Management", href: "/" },
      { name: "Setup", href: "/setup" },
      { name: "Workflow", href: "/setup/workflows" },
    ]);
  }, [setBreadcrumb]);

  useEffect(() => {
    updateBreadcrumb();
    setActiveStep({ id: 6, label: "Workflow" });
  }, [updateBreadcrumb]);

  const createWorkflow = async () => {
    router.push("/setup/create-workflow");
  };

  return (
    <FadeIn.Container className="bg-white md:bg-[#F2F3F3] h-full">
      <div className="p-4 md:p-6 h-full">
        <FadeIn.Item>
          <Flex
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
            mb={8}
          >
            <Text
              fontWeight={600}
              fontSize={{ base: "xl", md: "3xl" }}
              className="text-left"
            >
              Workflows
            </Text>
          </Flex>
        </FadeIn.Item>

        <FadeIn.Item>
          <div className="flex items-center justify-center gap-0 mb-8 md:hidden">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <React.Fragment key={num}>
                <ProgressCircle
                  number={num}
                  active={num === activeStep.id}
                  activeStep={activeStep.id}
                />
                {num < 8 && <ProgressLine />}
              </React.Fragment>
            ))}
          </div>
        </FadeIn.Item>

        <Box
          bg={workflows.length > 0 ? "transparent" : "white"}
          className="rounded-lg shadow-sm h-[75%] md:h-[90%]"
        >
          {workflows.length > 0 ? (
            <>
              <WorkflowVariants workflows={workflows} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-2 md:p-8">
              <Text
                fontWeight={600}
                fontSize={{ base: "2xl", md: "3xl" }}
                className="text-center"
              >
                Workflows
              </Text>
              <Text
                fontSize={{ base: 14, md: 16 }}
                color="#676A6C"
                className="mt-2"
              >
                Set up the approval process for leave requests. Define the steps
                involved, assign approvers, and establish deadlines for each
                stage.
              </Text>

              <div className="flex flex-col-reverse  md:flex-row md:items-center md:space-x-4 mt-5">
                <Button
                  py={4}
                  mb={{ base: 4, md: 0 }}
                  onClick={createWorkflow}
                  w={{ base: "300px", md: "200px" }}
                  // disabled={compOff?.isEnabled}
                >
                  Create Workflow
                </Button>
              </div>
            </div>
          )}
        </Box>
      </div>
    </FadeIn.Container>
  );
}
