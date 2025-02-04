"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { setupStepState } from "@/atoms/setup-atom";
import { userAtom } from "@/atoms/user-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { Workflow } from "@/lib/types";
import { Flex, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { WorkflowUpdateForm } from "./update-form";
import useSWR from "swr";

interface Props {
  id: string;
}

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

export function UpdateWorkflow({ id }: Props) {
  const [activeStep, setActiveStep] = useRecoilState(setupStepState);
  const [_, setBreadcrumb] = useRecoilState(breadcrumbState);
  const [data, setData] = React.useState<Workflow>({
    name: "",
    effectiveDate: "",
    process: "",
    subProcess: "",
    steps: [
      {
        id: 1,
        name: "",
        forwardToNext: false,
        forwardAfter: {
          days: "",
          hours: "",
        },
        assignedRoles: [],
      },
    ],
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const user = useRecoilValue(userAtom);

  const router = useRouter();

  const {
    data: workflowData,
    error,
    isLoading: workflowIsLoading,
  } = useSWR<any>(`/api/workflow/${id}`, fetcher);

  useEffect(() => {
    if (workflowData) {
      setData({
        name: workflowData.name,
        effectiveDate: workflowData.effectiveDate,
        process: workflowData.process,
        subProcess: workflowData.subProcess,
        steps: workflowData.steps,
      });
    }
  }, [workflowData]);

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

  const handlePrevious = () => {
    router.back();
  };

  const onSubmit = async () => {
    if (!data.name) {
      toast.error("Role name is required");
      return;
    }

    setIsLoading(true);
    try {
      const workflowData: Workflow = {
        ...data,
        employeesInvolved: 1,
        createdAt: new Date().toISOString(),
      };

      const tokens = localStorage.getItem("resolve-tokens");
      if (!tokens) return;

      const { token } = JSON.parse(tokens);

      const response = await fetch(`/api/workflow/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workflowData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update workflow");
      }

      toast.success("Workflow updated successfully");
      router.push("/setup/workflows");
    } catch (error: unknown) {
      console.error("Error updating workflow:", error);
      toast.error("Failed to update workflow", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDiscard = () => {
    setData({
      name: "",
      effectiveDate: null,
      process: "",
      subProcess: "",
      steps: [],
    });

    router.back();
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const tokens = localStorage.getItem("resolve-tokens");
      if (!tokens) return;

      const { token } = JSON.parse(tokens);

      const response = await fetch(`/api/workflow/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete workflow");
      }

      toast.success("Workflow deleted successfully");

      router.push("/setup/workflows");
    } catch (error) {
      toast.error("There was an error deleting the workflow");
    } finally {
      setIsLoading(false);
    }
  };

  if (workflowIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FadeIn.Container className="bg-[#F2F3F3] h-full rounded-lg shadow-sm space-y-4 md:p-5 overflow-y-scroll">
      <div className="space-y-4">
        <FadeIn.Item>
          <div className="p-4 md:px-6 md:py-8 flex items-center space-x-3 md:space-x-0 pb-4 md:pb-0 border-b border-[#F2F3F3] md:border-b-0">
            <Button
              bg="#F2F3F3"
              h="44px"
              w="44px"
              p={2}
              _hover={{ bg: "#fff" }}
              display={{ base: "inline", md: "none" }}
              onClick={handlePrevious}
            >
              <ChevronLeftIcon className="h-6 w-6 md:h-5 md:w-5 text-[#000000] md:text-[#9A9B9D]" />
            </Button>
            <div className="flex w-full">
              <Flex
                flexDir="row"
                gap={5}
                alignItems="center"
                justifyContent={{ base: "space-between", md: "normal" }}
                w={{ base: "100%", md: "50%" }}
              >
                <Text
                  fontWeight={600}
                  fontSize={{ base: "xl", md: "3xl" }}
                  className="text-left"
                >
                  Update Workflow
                </Text>
              </Flex>
            </div>
          </div>
        </FadeIn.Item>

        <WorkflowUpdateForm
          setData={setData}
          data={data}
          onSubmit={onSubmit}
          onDiscard={onDiscard}
          isLoading={isLoading}
          onDelete={onDelete}
        />
      </div>
    </FadeIn.Container>
  );
}
