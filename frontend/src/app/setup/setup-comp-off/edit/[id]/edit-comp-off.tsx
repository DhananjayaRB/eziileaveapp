"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { CompOffVariantForm } from "@/components/compoff-variants/form";
import { Button } from "@/components/core/button";
import { CompOffVariant } from "@/lib/types";
import { Flex, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
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

export function EditCompOff({ id }: Props) {
  const [__, setActiveStep] = useRecoilState(setupStepState);
  const [_, setBreadcrumb] = useRecoilState(breadcrumbState);

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

  const { data: fetchedVariant, isLoading } = useSWR(
    `/api/comp-off-variant/${id}`,
    fetcher
  );

  useEffect(() => {
    if (fetchedVariant) setData(fetchedVariant);
  }, [fetchedVariant]);

  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const updateBreadcrumb = useCallback(() => {
    setBreadcrumb((prev) => [
      { name: "Leave Management", href: "/" },
      { name: "Setup", href: "/setup" },
      { name: "Comp Off", href: "/setup/setup-comp-off" },
      { name: fetchedVariant?.variantName, href: "" },
    ]);
  }, [setBreadcrumb]);

  useEffect(() => {
    updateBreadcrumb();
    setActiveStep({ id: 3, label: "Comp off" });
  }, [updateBreadcrumb]);

  if (loading || isLoading) return <div>Loading...</div>;

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
      await fetch(`/api/comp-off-variant/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });
      toast.success("Variant updated successfully");
      router.back();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.error || "Failed to update variant");
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
                  Edit {fetchedVariant?.variantName}
                </Text>
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
                    Go Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn.Item>

        {/* HERE */}
        <FadeIn.Item>
          <CompOffVariantForm
            data={data}
            setData={setData}
            loading={loading}
            onSubmit={handleSubmit}
            isEditing={true}
            onDiscard={() => {
              router.back();
            }}
          />
        </FadeIn.Item>
      </div>
    </FadeIn.Container>
  );
}
