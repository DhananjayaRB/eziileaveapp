"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { settingsAtom } from "@/atoms/settings-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import {
  ProgressCircle,
  ProgressLine,
} from "@/components/core/progress-indicator";
import {
  BereavementLeaveIcon,
  CasualLeaveIcon,
  EarnedLeaveIcon,
  MarriageLeaveIcon,
  MaternityLeaveIcon,
  PaternityLeaveIcon,
  SickLeaveIcon,
} from "@/icons/leaves";
import { LeaveType } from "@/lib/types";
import { Flex, Icon, Skeleton, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { CgTrashEmpty } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";
import { FiChevronRight, FiPlus } from "react-icons/fi";
import { useRecoilState, useRecoilValue } from "recoil";
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

const iconMapping = {
  "Sick Leave": SickLeaveIcon,
  "Casual Leave": CasualLeaveIcon,
  "Earned Leave": EarnedLeaveIcon,
  "Maternity Leave": MaternityLeaveIcon,
  "Paternity Leave": PaternityLeaveIcon,
  "Marriage Leave": MarriageLeaveIcon,
  "Bereavement Leave": BereavementLeaveIcon,
};

const colorMapping = {
  "Sick Leave": "#FF95001A",
  "Casual Leave": "#34C7591A",
  "Earned Leave": "#007AFF1A",
  "Maternity Leave": "#FF2D551A",
  "Paternity Leave": "#5856D61A",
  "Marriage Leave": "#AF52DE1A",
  "Bereavement Leave": "#CCCDCE",
};

export default function Page() {
  const [activeStep, setActiveStep] = useRecoilState(setupStepState);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [__, setBreadcrumb] = useRecoilState(breadcrumbState);
  const setting = useRecoilValue(settingsAtom);
  const router = useRouter();

  const updateBreadcrumb = useCallback(() => {
    setBreadcrumb((prev) => [
      { name: "Leave Management", href: "/" },
      { name: "Setup", href: "/setup" },
      { name: "Leave Types", href: "/setup/leave-types" },
    ]);
  }, [setBreadcrumb]);

  useEffect(() => {
    updateBreadcrumb();
    setActiveStep({ id: 2, label: "Leave Types" });
  }, [updateBreadcrumb]);

  const { data: fetchedLeaveTypes, error } = useSWR(
    "/api/leave-type",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 60000 * 5,
    }
  );

  useEffect(() => {
    if (fetchedLeaveTypes) {
      setLeaveTypes(fetchedLeaveTypes);
      setIsLoading(false);
    }
  }, [fetchedLeaveTypes]);

  const handleDiscard = async (id: number) => {
    try {
      const tokens = localStorage.getItem("resolve-tokens");
      if (!tokens) return;

      const { token } = JSON.parse(tokens);

      const response = await fetch(`/api/leave-type`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, isActive: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to discard leave type");
      }

      const updatedLeaveType = await response.json();

      mutate(
        "/api/leave-type",
        (leaveTypes?: LeaveType[]) =>
          leaveTypes
            ? leaveTypes.map((leaveType) =>
                leaveType.id === id ? updatedLeaveType : leaveType
              )
            : [],
        false
      );
    } catch (error) {
      console.error("Error discarding leave type:", error);
    }
  };

  const restoreLeaveType = async (id: number) => {
    try {
      const tokens = localStorage.getItem("resolve-tokens");
      if (!tokens) return;

      const { token } = JSON.parse(tokens);

      const response = await fetch(`/api/leave-type`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, isActive: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to discard leave type");
      }

      const updatedLeaveType = await response.json();

      mutate(
        "/api/leave-type",
        (leaveTypes?: LeaveType[]) =>
          leaveTypes
            ? leaveTypes.map((leaveType) =>
                leaveType.id === id ? updatedLeaveType : leaveType
              )
            : [],
        false
      );
    } catch (error) {
      console.error("Error discarding leave type:", error);
    }
  };

  const hasVariantCount = (leaveTypes: LeaveType[]): boolean => {
    if (leaveTypes.length === 0) return false;
    return leaveTypes.some(
      (leaveType) => leaveType.variantCount > 0 && leaveType.isEnabled
    );
  };

  function handleNext() {
    if (setting.compOff.isEnabled) {
      router.push("/setup/setup-comp-off");
    } else {
      router.push("/setup/comp-off");
    }
  }

  return (
    <FadeIn.Container className="bg-white md:bg-[#F2F3F3] h-full">
      <div className="p-4 md:p-6 h-full">
        <FadeIn.Item>
          <Flex
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
            mb={8}
          >
            <Text
              fontWeight={600}
              fontSize={{ base: "xl", md: "3xl" }}
              className="text-left"
            >
              Leave Types
            </Text>

            <Button
              isDisabled={!hasVariantCount(leaveTypes)}
              icon={FiChevronRight}
              onClick={handleNext}
              iconPosition="right"
              py={4}
              px={4}
            >
              Next
            </Button>
          </Flex>
        </FadeIn.Item>

        <FadeIn.Item>
          <div className="flex items-center justify-center gap-0 mb-8 md:hidden">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <React.Fragment key={num}>
                <ProgressCircle
                  number={num}
                  active={num === activeStep.id}
                  activeStep={activeStep.id}
                />
                {num < 8 && <ProgressLine />}
              </React.Fragment>
            ))}
          </div>
        </FadeIn.Item>

        <div className="bg-white rounded-lg shadow-sm h-auto md:h-[90%]">
          <div className="flex flex-col items-center h-full text-center p-2 md:p-8 overflow-y-auto">
            {isLoading ? (
              <Skeleton height="100%" width="100%" borderRadius="8px" />
            ) : (
              <>
                {leaveTypes
                  .sort((a, b) => a.id - b.id)
                  .map((leave) => (
                    <div key={leave.id} className="w-full">
                      <FadeIn.Item>
                        <div
                          className="w-full flex flex-row items-center justify-between py-3 border-b border-[#E6E6E7] md:h-14 md:py-0 md:mb-4 md:border-none"
                          key={leave.id}
                        >
                          <div className="flex items-center space-x-3">
                            <Flex
                              p={3}
                              h={{ base: "42px", md: "56px" }}
                              w={{ base: "42px", md: "56px" }}
                              bg={
                                colorMapping[
                                  leave.name as keyof typeof colorMapping
                                ]
                              }
                              opacity={leave.isEnabled ? 1 : 0.5}
                              borderRadius="full"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Icon
                                as={
                                  iconMapping[
                                    leave.name as keyof typeof iconMapping
                                  ]
                                }
                                fontSize={{ base: 15, md: 30 }}
                              />
                            </Flex>
                            <Flex flexDir="column">
                              <Text
                                fontSize={{ base: 14, md: 16 }}
                                fontWeight={500}
                                color={leave.isEnabled ? "black" : "#9A9B9D"}
                              >
                                {leave.name}{" "}
                                {leave.isEnabled ? "" : "(Discarded)"}
                              </Text>
                              {leave.variantCount > 0 && (
                                <Text
                                  textAlign="left"
                                  fontSize={{ base: 13, md: 15 }}
                                  fontWeight={300}
                                  color={"#637587"}
                                >
                                  {leave.variantCount} variants
                                </Text>
                              )}
                            </Flex>
                          </div>

                          {leave.isEnabled ? (
                            <div className="flex items-center space-x-3">
                              <Button
                                display={{ base: "none", md: "inline" }}
                                variant="outline"
                                icon={FaTrash}
                                iconPosition="left"
                                onClick={() => handleDiscard(leave.id)}
                              >
                                Discard
                              </Button>
                              <Icon
                                as={CgTrashEmpty}
                                display={{ base: "inline", md: "none" }}
                                fontSize={24}
                                color="#08705C"
                                strokeWidth={1}
                                onClick={() => {
                                  handleDiscard(leave.id);
                                }}
                              />
                              <Button
                                display={{ base: "none", md: "inline" }}
                                icon={FiChevronRight}
                                iconPosition="right"
                                onClick={() => {
                                  // router.push(
                                  //   `/setup/${leave.name
                                  //     .toLowerCase()
                                  //     .replace(" ", "-")}`
                                  // );
                                  // setLT({ id: leave.id, name: leave.name });
                                  router.push(`/setup/leave-types/${leave.id}`);
                                }}
                              >
                                Create Leave
                              </Button>
                              <Button
                                display={{ base: "inline", md: "none" }}
                                onClick={() => {
                                  // router.push(
                                  //   `/setup/${leave.name
                                  //     .toLowerCase()
                                  //     .replace(" ", "-")}`
                                  // );
                                  router.push(`/setup/leave-types/${leave.id}`);
                                }}
                              >
                                Create
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Text
                                color="#08705C"
                                fontSize="14px"
                                fontWeight={600}
                                cursor="pointer"
                                onClick={() => restoreLeaveType(leave.id)}
                              >
                                Restore
                              </Text>
                            </>
                          )}
                        </div>
                      </FadeIn.Item>
                    </div>
                  ))}
                <div className="flex items-start w-full mt-5 md:mt-0">
                  <FadeIn.Item>
                    <Button
                      variant="outline"
                      icon={FiPlus}
                      iconPosition="right"
                    >
                      Create Custom Leave Type
                    </Button>
                  </FadeIn.Item>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </FadeIn.Container>
  );
}
