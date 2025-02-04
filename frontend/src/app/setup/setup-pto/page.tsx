"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { settingsAtom } from "@/atoms/settings-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { PTOVariantForm } from "@/components/pto-variants/form";
import { ShowPTOVariants } from "@/components/pto-variants/variants";
import { PTO, PTOVariant } from "@/lib/types";
import { Flex, Switch, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

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
  const [__, setActiveStep] = useRecoilState(setupStepState);
  const [_, setBreadcrumb] = useRecoilState(breadcrumbState);

  const [variants, setVariants] = React.useState<PTOVariant[]>([]);
  const setting = useRecoilValue(settingsAtom);
  const [data, setData] = React.useState<PTOVariant>({
    unitsAllowed: [],
    variantName: "",
    description: "",
    applicableAfter: {
      days: "",
      duration: "doj",
    },
    requiresReviewWorkflow: false,
    approvalRequestsMadeBefore: "",
    minimumHoursRequired: "",
    maxHoursAllowed: "",
    maxInstances: {
      days: "",
      duration: "month",
    },
    ptoDuringNoticePeriod: false,
    supportingDocuments: {
      status: "required",
      description: "",
    },
    ptoCrossed: {
      option: "lop",
      subOptions: [],
    },
    ptoGranted: "yearly",
    assignedTo: [],
  });

  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const { data: fetchedVariants } = useSWR("/api/pto-variant", fetcher);

  useEffect(() => {
    if (fetchedVariants) setVariants(fetchedVariants);
  }, [fetchedVariants]);

  const handleDelete = async (variantId: number) => {
    const tokens = localStorage.getItem("resolve-tokens");
    if (!tokens) return;

    const { token } = JSON.parse(tokens);

    try {
      const response = await fetch(`/api/pto-variant/${variantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete variant");

      await mutate("/api/pto-variant");
      toast.success("PTO variant deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete PTO variant");
    }
  };

  const updateBreadcrumb = useCallback(() => {
    setBreadcrumb((prev) => [
      { name: "Leave Management", href: "/" },
      { name: "Setup", href: "/setup" },
      { name: "PTO", href: "/setup/pto" },
    ]);
  }, [setBreadcrumb]);

  useEffect(() => {
    updateBreadcrumb();
    setActiveStep({ id: 4, label: "PTO" });
  }, [updateBreadcrumb]);

  const handleDisablePTO = async () => {
    const tokens = localStorage.getItem("resolve-tokens");
    if (!tokens) return;

    const { token } = JSON.parse(tokens);
    try {
      const response = await fetch(`/api/pto`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isEnabled: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to disable PTO");
      }

      await response.json();

      mutate(
        "/api/pto",
        (prevPto?: PTO) =>
          ({
            ...prevPto,
            isEnabled: false,
          } as PTO),
        false
      );
    } catch (error) {
      console.error("Error disabling PTO:", error);
    }
  };

  const handleSetupPTO = async () => {
    const tokens = localStorage.getItem("resolve-tokens");
    if (!tokens) return;

    const { token } = JSON.parse(tokens);
    try {
      const response = await fetch(`/api/pto`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isEnabled: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to disable PTO");
      }

      await response.json();

      mutate(
        "/api/pto",
        (prevPto?: PTO) =>
          ({
            ...prevPto,
            isEnabled: true,
          } as PTO),
        false
      );
    } catch (error) {
      console.error("Error disabling PTO:", error);
    }
  };

  async function handleSwitchChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      await handleSetupPTO();
    } else {
      await handleDisablePTO();
    }
  }

  async function handleSubmit() {
    setLoading(true);
    const tokens = localStorage.getItem("resolve-tokens");
    if (!tokens) return;
    const { token } = JSON.parse(tokens);
    const { pto, ...dataWithoutPto } = data;

    const obj = {
      ...dataWithoutPto,
      assignedTo: data.assignedTo,
    };

    try {
      await fetch("/api/pto-variant", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });
      toast.success("Variant created successfully", {
        description: `PTO Variant ${obj.variantName} created successfully`,
      });
      await mutate("/api/pto-variant");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to create variant", {
        description: error.message || "Failed to create variant",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <FadeIn.Container className="bg-white md:bg-[#F2F3F3] h-full">
      <div className="p-4 md:px-6 md:py-8 h-full">
        <FadeIn.Item>
          <div className="flex items-center space-x-3 mb-4 pb-4 md:pb-0 border-b border-[#F2F3F3] md:border-b-0">
            <Button
              bg="#fff"
              h="44px"
              w="44px"
              p={2}
              _hover={{ bg: "#fff" }}
              display={{ base: "inline", md: "none" }}
              onClick={() => router.push("/setup/setup-comp-off")}
            >
              <ChevronLeftIcon className="h-6 w-6 md:h-5 md:w-5 text-[#000000] md:text-[#9A9B9D]" />
            </Button>
            <div className="flex items-center justify-between w-full">
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
                  PTO (Personal Time Off)
                </Text>
                <Switch
                  colorScheme="green"
                  isChecked={setting.pto.isEnabled}
                  onChange={handleSwitchChange}
                  sx={{
                    "& .chakra-switch__track[data-checked]": {
                      backgroundColor: "#08705C",
                    },
                  }}
                />
              </Flex>

              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-3">
                  <Button
                    variant="outline"
                    icon={FiChevronLeft}
                    iconPosition="right"
                    onClick={() => router.push("/setup/setup-comp-off")}
                    py={3}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="solid"
                    icon={FiChevronRight}
                    iconPosition="right"
                    onClick={() => router.push("/setup/roles")}
                    py={3}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn.Item>

        <FadeIn.Item>
          {variants.length > 0 ? (
            <ShowPTOVariants
              variants={variants}
              handleDelete={handleDelete}
              handleEdit={(id: number) =>
                router.push(`/setup/setup-pto/edit/${id}`)
              }
              handleCreate={() => router.push("/setup/setup-pto/new")}
              handlePrevious={() => router.push("/setup/setup-comp-off")}
              handleNext={() => router.push("/setup/roles")}
            />
          ) : (
            <PTOVariantForm
              data={data}
              setData={setData}
              loading={loading}
              onSubmit={handleSubmit}
              isEditing={false}
              onDiscard={() => router.back()}
            />
          )}
        </FadeIn.Item>
      </div>
    </FadeIn.Container>
  );
}
