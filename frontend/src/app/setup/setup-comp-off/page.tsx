"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { settingsAtom } from "@/atoms/settings-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { CompOffVariantForm } from "@/components/compoff-variants/form";
import { ShowCompOffVariants } from "@/components/compoff-variants/variants";
import { Button } from "@/components/core/button";
import { CompOff, CompOffVariant } from "@/lib/types";
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
  const [variants, setVariants] = React.useState<CompOffVariant[]>([]);
  const setting = useRecoilValue(settingsAtom);

  const [data, setData] = React.useState<CompOffVariant>({
    unitsAllowed: [],
    minimumHoursRequired: "",
    variantName: "",
    description: "",
    maxCompOffApplications: {
      duration: "month",
      count: "",
    },
    requiresReviewWorkflow: true,
    approvalRequestsMadeBefore: "",
    availedWithin: "",
    allowNonWorkingDays: true,
    withdrawalOfApplicationAllowed: "beforeApproval",
    compOffsDuringNoticePeriod: true,
    carryForwardEnabled: true,
    carryForwardLapseIn: {
      duration: "month",
      limit: "",
    },
    carryForwardToNextCycle: "",
    compensationEnabled: true,
    maxDaysThatCanBeEncashed: {
      days: "",
      hours: "",
    },
    compensationOptions: [],
    assignedTo: [],
  });

  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const { data: fetchedVariants } = useSWR("/api/comp-off-variant", fetcher);

  useEffect(() => {
    if (fetchedVariants) setVariants(fetchedVariants);
  }, [fetchedVariants]);

  const updateBreadcrumb = useCallback(() => {
    setBreadcrumb((prev) => [
      { name: "Leave Management", href: "/" },
      { name: "Setup", href: "/setup" },
      { name: "Comp Off", href: "/setup/comp-off" },
    ]);
  }, [setBreadcrumb]);

  useEffect(() => {
    updateBreadcrumb();
    setActiveStep({ id: 3, label: "Comp off" });
  }, [updateBreadcrumb]);

  const handleDelete = async (variantId: number) => {
    const tokens = localStorage.getItem("resolve-tokens");
    if (!tokens) return;

    const { token } = JSON.parse(tokens);

    setLoading(true);
    try {
      const response = await fetch(`/api/comp-off-variant/${variantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete variant");

      await mutate("/api/comp-off-variant");
      toast.success("Comp-off variant deleted successfully", {
        description: "The variant has been deleted successfully",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comp-off variant");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableCompOff = async () => {
    const tokens = localStorage.getItem("resolve-tokens");
    if (!tokens) return;
    const { token } = JSON.parse(tokens);
    setLoading(true);
    try {
      const response = await fetch(`/api/comp-offs`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isEnabled: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to disable comp off");
      }
      await response.json();
      mutate(
        "/api/comp-offs",
        (prevCompOff?: CompOff) =>
          ({
            ...prevCompOff,
            isEnabled: false,
          } as CompOff),
        false
      );
    } catch (error) {
      console.error("Error disabling comp off:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupCompOff = async () => {
    const tokens = localStorage.getItem("resolve-tokens");
    if (!tokens) return;
    const { token } = JSON.parse(tokens);
    setLoading(true);
    try {
      const response = await fetch(`/api/comp-offs`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isEnabled: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to disable comp off");
      }
      await response.json();
      mutate(
        "/api/comp-offs",
        (prevCompOff?: CompOff) =>
          ({
            ...prevCompOff,
            isEnabled: true,
          } as CompOff),
        false
      );
    } catch (error) {
      console.error("Error disabling comp off:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleSwitchChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      await handleSetupCompOff();
    } else {
      await handleDisableCompOff();
    }
  }

  async function handleSubmit() {
    setLoading(true);
    const tokens = localStorage.getItem("resolve-tokens");
    if (!tokens) return;
    const { token } = JSON.parse(tokens);
    const { compOff, ...dataWithoutCompOff } = data;

    const obj = {
      ...dataWithoutCompOff,
      assignedTo: data.assignedTo,
    };

    try {
      await fetch("/api/comp-off-variant", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });
      toast.success("Variant created successfully", {
        description: `The variant ${obj.variantName} has been created successfully`,
      });
      await mutate("/api/comp-off-variant");
    } catch (error: unknown) {
      console.error(error);
      toast.error(error.response.data.error || "Failed to create variant");
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    if (setting.pto.isEnabled) {
      router.push("/setup/setup-pto");
    } else {
      router.push("/setup/pto");
    }
  };

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
              onClick={() => {
                router.push("/setup/leave-types");
              }}
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
                  Comp off
                </Text>
                <Switch
                  colorScheme="green"
                  isChecked={setting.compOff.isEnabled}
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
                    onClick={() => router.back()}
                    py={3}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="solid"
                    icon={FiChevronRight}
                    iconPosition="right"
                    onClick={handleNext}
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
            <>
              <ShowCompOffVariants
                variants={variants}
                handleDelete={handleDelete}
                handleEdit={(id) =>
                  router.push(`/setup/setup-comp-off/edit/${id}`)
                }
                handleCreate={() => router.push("/setup/setup-comp-off/new")}
                handlePrevious={() => router.back()}
                handleNext={handleNext}
              />
            </>
          ) : (
            <CompOffVariantForm
              data={data}
              setData={setData}
              loading={loading}
              onSubmit={handleSubmit}
              isEditing={false}
              onDiscard={() => {
                router.back();
              }}
            />
          )}
        </FadeIn.Item>
      </div>
    </FadeIn.Container>
  );
}
