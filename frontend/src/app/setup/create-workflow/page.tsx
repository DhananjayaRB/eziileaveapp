"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import SuccessModal from "@/components/modal/success";
import { WorkflowForm } from "@/components/workflows/form";
import { Workflow } from "@/lib/types";
import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

export default function Page() {
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
  const { isOpen, onClose, onOpen } = useDisclosure();

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

  const handlePrevious = () => {
    router.back();
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const tokens = localStorage.getItem("resolve-tokens");
      if (!tokens) return;

      const { token } = JSON.parse(tokens);

      const workflowData: Workflow = {
        ...data,
        employeesInvolved: 1,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("/api/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workflowData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create workflow");
      }

      toast.success("Workflow created successfully");
      onOpen();

      setTimeout(() => {
        router.push("/setup/workflows");
      }, 5000);
    } catch (error: unknown) {
      console.error("Error creating workflow:", error);
      toast.error("Failed to create workflow", {
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

  return (
    <>
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
                    New Workflow
                  </Text>
                </Flex>
              </div>
            </div>
          </FadeIn.Item>

          <WorkflowForm
            setData={setData}
            data={data}
            onSubmit={onSubmit}
            onDiscard={onDiscard}
            isLoading={isLoading}
          />
        </div>
      </FadeIn.Container>

      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        heading="New Workflow Created"
      />
    </>
  );
}
