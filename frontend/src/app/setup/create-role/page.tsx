"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { RoleForm } from "@/components/role/form";
import { useResolveAPI } from "@/hooks/resolve";
import { ApplyTo, Role } from "@/lib/types";
import { toCamelCase } from "@/lib/utils";
import { Flex, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

export default function Page() {
  const [activeStep, setActiveStep] = useRecoilState(setupStepState);
  const { organisationStructure } = useResolveAPI();
  const [_, setBreadcrumb] = useRecoilState(breadcrumbState);
  const [data, setData] = React.useState<Role>({
    roleName: "",
    permissions: {
      "Leave Approval": { view: false, modify: false },
      Workflows: { view: false, modify: false },
      "Leave Types": { view: false, modify: false },
      "Leave Configurations": { view: false, modify: false },
      "PTO Configurations": { view: false, modify: false },
      "Comp-Off Configurations": { view: false, modify: false },
    },
    allowOnBehalfOfOthers: {
      Leave: false,
      "Comp-Off": false,
      PTO: false,
    },
    assignedTo: [],
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [applyTo, setApplyTo] = React.useState<ApplyTo>({});

  useEffect(() => {
    if (organisationStructure?.configs.sub_types) {
      organisationStructure?.configs.sub_types.forEach((subType) => {
        setApplyTo((prev) => ({
          ...prev,
          [subType.sub_type]: [],
        }));
      });
    }
  }, [organisationStructure?.configs.sub_types]);

  const router = useRouter();

  const updateBreadcrumb = useCallback(() => {
    setBreadcrumb((prev) => [
      { name: "Leave Management", href: "/" },
      { name: "Setup", href: "/setup" },
      { name: "Roles", href: "/setup/roles" },
    ]);
  }, [setBreadcrumb]);

  useEffect(() => {
    updateBreadcrumb();
    setActiveStep({ id: 5, label: "Roles" });
  }, [updateBreadcrumb]);

  const handlePrevious = () => {
    router.back();
  };

  const removeBadge = (key: string, category: string) => {
    setApplyTo((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== key),
    }));
  };

  const handleSelect = (selected: string, category: keyof typeof applyTo) => {
    if (applyTo[category].includes(selected)) {
      return;
    }
    setApplyTo((prev) => {
      return {
        ...prev,
        [category]: [...prev[category], selected],
      };
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const camelCasedApplyTo = Object.fromEntries(
        Object.entries(applyTo).map(([key, value]) => [toCamelCase(key), value])
      );

      const tokens = localStorage.getItem("resolve-tokens");
      if (!tokens) return;

      const { token } = JSON.parse(tokens);

      const transformedData = {
        allowOnBehalfOfOthers: data.allowOnBehalfOfOthers,
        compOffConfigurations: data.permissions["Comp-Off Configurations"],
        leaveApproval: data.permissions["Leave Approval"],
        leaveConfigurations: data.permissions["Leave Configurations"],
        leaveTypes: data.permissions["Leave Types"],
        ptoConfigurations: data.permissions["PTO Configurations"],
        workflows: data.permissions.Workflows,
        roleName: data.roleName,
        ...camelCasedApplyTo,
        assignedTo: data.assignedTo,
      };

      const response = await fetch("/api/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create role");
      }

      toast.success("Role created successfully");
      router.push("/setup/roles");
    } catch (error: any) {
      console.error("Error creating role:", error);
      toast.error("There was an error creating the role", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDiscard = () => {
    setData({
      roleName: "",
      permissions: {
        "Leave Approval": { view: false, modify: false },
        Workflows: { view: false, modify: false },
        "Leave Types": { view: false, modify: false },
        "Leave Configurations": { view: false, modify: false },
        "PTO Configurations": { view: false, modify: false },
        "Comp-Off Configurations": { view: false, modify: false },
      },
      allowOnBehalfOfOthers: {
        Leave: false,
        "Comp-Off": false,
        PTO: false,
      },
      assignedTo: [],
    });
    if (organisationStructure?.configs.sub_types) {
      organisationStructure?.configs.sub_types.forEach((subType) => {
        setApplyTo((prev) => ({
          ...prev,
          [subType.sub_type]: [],
        }));
      });
    }
    router.back();
  };

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
                  Create Role
                </Text>
              </Flex>
            </div>
          </div>
        </FadeIn.Item>

        <RoleForm
          setData={setData}
          data={data}
          applyTo={applyTo}
          handleSelect={handleSelect}
          removeBadge={removeBadge}
          onSubmit={onSubmit}
          onDiscard={onDiscard}
          isLoading={isLoading}
        />
      </div>
    </FadeIn.Container>
  );
}
