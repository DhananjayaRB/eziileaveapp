"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import {
  ProgressCircle,
  ProgressLine,
} from "@/components/core/progress-indicator";
import { PTO } from "@/lib/types";
import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
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
  const [activeStep, setActiveStep] = useRecoilState(setupStepState);
  const [_, setBreadcrumb] = useRecoilState(breadcrumbState);
  const [pto, setPto] = React.useState<PTO>();
  const router = useRouter();

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

  const { data: fetchedPto, error } = useSWR("/api/pto", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 60000 * 5,
  });

  useEffect(() => {
    if (fetchedPto) {
      setPto(fetchedPto);
      if (fetchedPto.isEnabled) {
        router.push("/setup/setup-pto");
      }
    }
  }, [fetchedPto, router]);

  const handleDisablePto = async () => {
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
        throw new Error("Failed to disable comp off");
      }

      const updatedPto = await response.json();

      mutate(
        "/api/pto",
        (prevPto?: PTO) =>
          ({
            ...prevPto,
            isEnabled: false,
          } as PTO),
        false
      );
      //   route to the next page here
    } catch (error) {
      console.error("Error disabling comp off:", error);
    }
  };

  const handleSetupPto = async () => {
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
        throw new Error("Failed to disable comp off");
      }

      const updatedPto = await response.json();

      mutate(
        "/api/pto",
        (prevPto?: PTO) =>
          ({
            ...prevPto,
            isEnabled: true,
          } as PTO),
        false
      );
      router.push("/setup/setup-pto");
    } catch (error) {
      console.error("Error enabling comp off:", error);
    }
  };

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
              PTO
            </Text>
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

        <div className="bg-white rounded-lg shadow-sm h-[75%] md:h-[90%]">
          <div className="flex flex-col items-center justify-center h-full text-center p-2 md:p-8">
            <Text
              fontWeight={600}
              fontSize={{ base: "2xl", md: "3xl" }}
              className="text-center"
            >
              Do you want to enable PTO (Paid Time Off)?
            </Text>
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#676A6C"
              className="mt-2"
            >
              Offer personalized Paid time off benefits to your employees
            </Text>

            <div className="flex flex-col-reverse  md:flex-row md:items-center md:space-x-4 mt-5">
              <Button
                variant="outline"
                py={4}
                onClick={handleDisablePto}
                disabled={!pto?.isEnabled}
                w={{ base: "300px", md: "200px" }}
              >
                Proceed without PTO
              </Button>
              <Button
                py={4}
                mb={{ base: 4, md: 0 }}
                onClick={handleSetupPto}
                w={{ base: "300px", md: "200px" }}
                // disabled={compOff?.isEnabled}
              >
                Setup PTO
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FadeIn.Container>
  );
}
