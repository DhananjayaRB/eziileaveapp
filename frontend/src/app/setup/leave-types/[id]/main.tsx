"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { LeaveVariantForm } from "@/components/leave-variants/form";
import { ShowVariants } from "@/components/leave-variants/variants";
import {
  MarriageLeaveIcon,
  PaternityLeaveIcon,
  CasualLeaveIcon,
  MaternityLeaveIcon,
  BereavementLeaveIcon,
  EarnedLeaveIcon,
  SickLeaveIcon,
} from "@/icons/leaves";
import { LeaveVariant, LeaveVariantResponse } from "@/lib/types";
import { Box, Icon, Skeleton, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

interface Props {
  id: string;
}

const iconMapping: { [key: string]: React.ElementType } = {
  "Sick Leave": SickLeaveIcon,
  "Casual Leave": CasualLeaveIcon,
  "Earned Leave": EarnedLeaveIcon,
  "Maternity Leave": MaternityLeaveIcon,
  "Paternity Leave": PaternityLeaveIcon,
  "Marriage Leave": MarriageLeaveIcon,
  "Bereavement Leave": BereavementLeaveIcon,
};

const colorMapping: { [key: string]: string } = {
  "Sick Leave": "#FF95001A",
  "Casual Leave": "#34C7591A",
  "Earned Leave": "#007AFF1A",
  "Maternity Leave": "#FF2D551A",
  "Paternity Leave": "#5856D61A",
  "Marriage Leave": "#AF52DE1A",
  "Bereavement Leave": "#CCCDCE",
};

export function Main({ id }: Props) {
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
  const [isEditing, setIsEditing] = useState(false);

  const [_, setBreadcrumb] = useRecoilState(breadcrumbState);

  const {
    data: fetchedVariant,
    error,
    isLoading,
  } = useSWR(`/api/leave-variants?leaveTypeId=${id}`, fetcher) as {
    data: LeaveVariantResponse;
    error: any;
    isLoading: boolean;
  };

  useEffect(() => {
    if (fetchedVariant) {
      setBreadcrumb([
        { name: "Leave Management", href: "/" },
        { name: "Setup", href: "/setup" },
        {
          name: fetchedVariant.leaveType.name,
          href: `/setup/leave-types/${id}`,
        },
      ]);
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

  const handleEdit = (variant: LeaveVariant) => {
    router.push(`/setup/leave-types/${id}/edit/${variant.id}`);
  };

  const handleCreate = () => {
    router.push(`/setup/leave-types/${id}/new`);
  };

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

    try {
      const response = await fetch(`/api/leave-variants?leaveTypeId=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Failed to create leave variant");

      toast.success("Leave variant created successfully", {
        description: `Leave variant ${data.variantName} created successfully`,
      });
      router.back();
    } catch (error: any) {
      toast.error("Failed to create leave variant", {
        description: error.message || "Failed to create leave variant",
      });
      console.log(error);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  }

  async function onDelete(variantId: number) {
    const tokens = localStorage.getItem("resolve-tokens");
    if (!tokens) return;

    const { token } = JSON.parse(tokens);

    try {
      const response = await fetch(
        `/api/leave-variants?leaveTypeId=${variantId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete variant");

      await mutate(`/api/leave-variants?leaveTypeId=${id}`);
      toast.success("Leave variant deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete leave variant");
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
            <Box
              bg={colorMapping[fetchedVariant.leaveType.name]}
              className="hidden md:flex w-16 h-16 rounded-full items-center justify-center"
            >
              <Icon
                as={iconMapping[fetchedVariant.leaveType.name]}
                fontSize={24}
              />
            </Box>
            <div className="flex items-center justify-between w-full">
              <Text
                fontWeight={600}
                fontSize={{ base: "xl", md: "3xl" }}
                className="text-left"
              >
                {fetchedVariant.leaveType.name}
              </Text>

              <div className="flex items-center space-x-3">
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
                          onClick={() => router.push("/setup/leave-types")}
                          py={3}
                        >
                          Next
                        </Button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </FadeIn.Item>

        <FadeIn.Item>
          <div>
            {fetchedVariant.variants.length > 0 ? (
              <ShowVariants
                variants={fetchedVariant.variants}
                handleDelete={onDelete}
                handleEdit={handleEdit}
                accent={"#FF9500"}
                handleCreate={handleCreate}
                handlePrevious={() => router.push("/setup/leave-types")}
                handleNext={() => router.push("/setup/leave-types")}
              />
            ) : (
              <>
                <LeaveVariantForm
                  data={data}
                  setData={setData}
                  loading={loading}
                  onSubmit={onSubmit}
                  editMode={false}
                  onDiscard={() => {
                    router.back();
                  }}
                />
              </>
            )}
          </div>
        </FadeIn.Item>
      </div>
    </FadeIn.Container>
  );
}
