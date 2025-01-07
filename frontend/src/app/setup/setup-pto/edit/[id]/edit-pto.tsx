"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { PTOVariantForm } from "@/components/pto-variants/form";
import { PTOVariant } from "@/lib/types";
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

export function EditPTO({ id }: Props) {
  const [__, setActiveStep] = useRecoilState(setupStepState);
  const [_, setBreadcrumb] = useRecoilState(breadcrumbState);

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

  const { data: fetchedVariant, isLoading } = useSWR(
    `/api/pto-variant/${id}`,
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
      { name: "PTO", href: "/setup/setup-pto" },
      { name: fetchedVariant?.variantName, href: "" },
    ]);
  }, [setBreadcrumb]);

  useEffect(() => {
    updateBreadcrumb();
    setActiveStep({ id: 3, label: "PTO" });
  }, [updateBreadcrumb]);

  if (loading || isLoading) return <div>Loading...</div>;

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
      await fetch(`/api/pto-variant/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });
      toast.success("Variant updated successfully", {
        description: `PTO Variant ${obj.variantName} updated successfully`,
      });
      router.back();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update variant");
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

        <FadeIn.Item>
          <PTOVariantForm
            data={data}
            setData={setData}
            loading={loading}
            onSubmit={handleSubmit}
            isEditing={true}
            onDiscard={() => router.back()}
          />
        </FadeIn.Item>
      </div>
    </FadeIn.Container>
  );
}
