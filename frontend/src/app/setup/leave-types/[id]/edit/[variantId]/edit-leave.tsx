"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { LeaveVariantForm } from "@/components/leave-variants/form";
import { LeaveVariant } from "@/lib/types";
import { Skeleton, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
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

interface Props {
  id: string;
  variantId: string;
}

export function EditLeave({ id, variantId }: Props) {
  const router = useRouter();

  const [data, setData] = useState<LeaveVariant>({
    minimumLeaveUnit: [],
    variantName: "",
    description: "",
    leavesGrantedBasedOn: "calendarDays",
    paidDaysInAYear: "",
    grantLeaves: "inAdvance",
    grantPer: "perMonth",
    proRataCalculation: "Full Month",
    monthlySlabs: [{ earn: "", days: "" }],
    applicableFor: [],
    applicableAfter: "",
    mustBePlannedInAdvanceBy: "",
    maxDaysInAStretch: "",
    minDaysRequiredForALeave: "",
    maxInstances: { days: "", duration: "" },
    leavesImmediatelyBeforeAndAfterAWeekend: "allowed",
    leavesImmediatelyBeforeAndAfterAHoliday: "allowed",
    clubbingWithOtherLeaveTypes: "notAllowed",
    supportingDocuments: { status: "required", description: "" },
    leavesDuringNoticePeriod: "allowed",
    requiresReviewWorkflow: "workflow",
    deductBalanceBeforeWorkflow: "beforeWorkflow",
    gracePeriodForApplying: "",
    withdrawalOfApplicationAllowed: "beforeApproval",
    negativeLeaveBalanceAllowedUpTo: "",
    carryForwardLimit: { duration: "monthly", limit: "" },
    enCashment: true,
    enCashmentCalculation: [],
    maxDaysEnCashable: "",
    enCashmentAt: "exit",
    allowApplicationsOnBehalfOfOthers: "allowed",
    showLeaveDataInPayslips: [],
    allowAsPlannedLeave: "allowed",
    assignedTo: [],
  });
  const [loading, setLoading] = useState(false);

  const [b, setBreadcrumb] = useRecoilState(breadcrumbState);

  const {
    data: fetchedVariant,
    error,
    isLoading,
  } = useSWR(`/api/leave-variants/${variantId}`, fetcher) as {
    data: LeaveVariant;
    error: unknown;
    isLoading: boolean;
  };

  useEffect(() => {
    if (fetchedVariant) {
      setData(fetchedVariant);
      setBreadcrumb([...b, { name: fetchedVariant.variantName, href: "" }]);
    }
  }, [fetchedVariant]);

  if (isLoading)
    return (
      <div className="bg-white rounded-lg shadow-sm h-auto md:h-[90%]">
        <div className="flex flex-col items-center h-full text-center p-2 md:p-8 overflow-y-auto">
          <Skeleton height="100%" width="100%" borderRadius="8px" />
        </div>
      </div>
    );

  async function onSubmit() {
    const tokens = localStorage.getItem("resolve-tokens");
    if (!tokens) return;

    const { token } = JSON.parse(tokens);

    setLoading(true);

    const obj = {
      ...data,
      paidDaysInAYear: Number(data.paidDaysInAYear),
      assignedTo: data.assignedTo,
    };

    console.log(obj);

    try {
      const response = await fetch(`/api/leave-variants/${variantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Failed to update leave variant");

      toast.success("Leave variant updated successfully", {
        description: `Leave variant ${data.variantName} updated successfully`,
      });
      router.back();
    } catch (error: unknown) {
      toast.error("Failed to update leave variant", {
        description: error.message || "Failed to update leave variant",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FadeIn.Container className="bg-white md:bg-[#F2F3F3] h-full">
      <div className="p-4 md:px-6 md:py-8 h-full">
        <FadeIn.Item>
          <div className="flex items-center space-x-3 mb-6 pb-4 md:pb-0 border-b border-[#F2F3F3] md:border-b-0">
            <Button
              bg="#fff"
              h="44px"
              w="44px"
              p={2}
              _hover={{ bg: "#fff" }}
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeftIcon className="h-10 w-10 md:h-5 md:w-5 text-[#000000] md:text-[#9A9B9D]" />
            </Button>

            <div className="flex items-center justify-between w-full">
              <Text
                fontWeight={600}
                fontSize={{ base: "xl", md: "3xl" }}
                className="text-left"
              >
                {fetchedVariant.variantName}
              </Text>

              {/* <div className="flex items-center space-x-3">
                {isEditing ? (
                  <Button
                    variant="outline"
                    icon={FiChevronLeft}
                    iconPosition="left"
                    display={{ base: "none", md: "inline" }}
                    onClick={() => setIsEditing(false)}
                  >
                    Show Variants
                  </Button>
                ) : (
                  <>
                    {fetchedVariant.variants.length > 0 ? (
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
                          //   onClick={handleNext}
                          py={3}
                        >
                          Next
                        </Button>
                      </div>
                    ) : null}
                  </>
                )}
              </div> */}
            </div>
          </div>
        </FadeIn.Item>

        <FadeIn.Item>
          <LeaveVariantForm
            data={data}
            setData={setData}
            loading={loading}
            onSubmit={onSubmit}
            editMode={true}
            onDiscard={() => {
              router.back();
            }}
          />
        </FadeIn.Item>
      </div>
    </FadeIn.Container>
  );
}
