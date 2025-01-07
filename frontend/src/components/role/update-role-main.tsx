"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { useResolveAPI } from "@/hooks/resolve";
import { ApplyTo, Role } from "@/lib/types";
import { toCamelCase } from "@/lib/utils";
import { Flex, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import useSWR from "swr";
import { UpdateRoleForm } from "./update-form";

interface Props {
  id: number;
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

export function UpdateRole({ id }: Props) {
  const [activeStep, setActiveStep] = useRecoilState(setupStepState);
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
  const [applyTo, setApplyTo] = React.useState<ApplyTo>({});
  const { organisationStructure } = useResolveAPI();

  const [loading, setLoading] = React.useState(false);

  const {
    data: roleData,
    error,
    isLoading,
  } = useSWR(`/api/role/${id}`, fetcher) as {
    data: any;
    error: any;
    isLoading: boolean;
  };

  useEffect(() => {
    if (roleData) {
      setData({
        roleName: roleData.roleName,
        permissions: {
          "Leave Approval": roleData.leaveApproval || {
            view: false,
            modify: false,
          },
          Workflows: roleData.workflows || { view: false, modify: false },
          "Leave Types": roleData.leaveTypes || { view: false, modify: false },
          "Leave Configurations": roleData.leaveConfigurations || {
            view: false,
            modify: false,
          },
          "PTO Configurations": roleData.ptoConfigurations || {
            view: false,
            modify: false,
          },
          "Comp-Off Configurations": roleData.compOffConfigurations || {
            view: false,
            modify: false,
          },
        },
        allowOnBehalfOfOthers: roleData.allowOnBehalfOfOthers || {
          Leave: false,
          "Comp-Off": false,
          PTO: false,
        },
        assignedTo: roleData.assignedTo || [],
      });

      if (organisationStructure?.configs.sub_types) {
        const formattedApplyTo: ApplyTo = {};
        organisationStructure.configs.sub_types.forEach((subType) => {
          formattedApplyTo[toCamelCase(subType.sub_type)] =
            roleData[toCamelCase(subType.sub_type)] || [];
        });
        setApplyTo(formattedApplyTo);
      }
    }
  }, [roleData, organisationStructure]);

  const router = useRouter();

  const updateBreadcrumb = useCallback(() => {
    setBreadcrumb((prev) => [
      { name: "Leave Management", href: "/" },
      { name: "Setup", href: "/setup" },
      { name: "Roles", href: "/setup/roles" },
      { name: "Update Role", href: `/setup/roles/${id}` },
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
    setLoading(true);
    try {
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
        ...applyTo,
      };

      const response = await fetch(`/api/role/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      toast.success("Role updated successfully");

      router.push("/setup/roles");
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast.error("There was an error updating the role", {
        description: error.message,
      });
    } finally {
      setLoading(false);
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
    setApplyTo({
      location: [],
      division: [],
      function: [],
      designation: [],
    });

    router.back();
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      const tokens = localStorage.getItem("resolve-tokens");
      if (!tokens) return;

      const { token } = JSON.parse(tokens);
      const response = await fetch(`/api/role/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete role");
      }

      toast.success("Role deleted successfully");

      router.push("/setup/roles");
    } catch (error) {
      toast.error("There was an error deleting the role");
    } finally {
      setLoading(false);
    }
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
                  Update Role
                </Text>
              </Flex>
            </div>
          </div>
        </FadeIn.Item>

        <UpdateRoleForm
          setData={setData}
          data={data}
          applyTo={applyTo}
          handleSelect={handleSelect}
          removeBadge={removeBadge}
          onSubmit={onSubmit}
          onDiscard={onDiscard}
          isLoading={loading}
          onDelete={onDelete}
        />
      </div>
    </FadeIn.Container>
  );
}
