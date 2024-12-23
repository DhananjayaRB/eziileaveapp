"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Flex, Text } from "@chakra-ui/react";
import { CalendarIcon } from "lucide-react";
import { PopoverTrigger } from "@radix-ui/react-popover";
import cn from "classnames";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { Calendar } from "@/components/ui/calendar";
import { settingsAtom } from "@/atoms/settings-atom";
import {
  ProgressCircle,
  ProgressLine,
} from "@/components/core/progress-indicator";
import { toast } from "sonner";
import { mutate } from "swr";

export default function Page() {
  const [activeStep, setActiveStep] = useRecoilState(setupStepState);
  const [_, setBreadcrumb] = useRecoilState(breadcrumbState);
  const router = useRouter();
  const [settingAtom] = useRecoilState(settingsAtom);
  const [date, setDate] = React.useState<Date | null>(
    settingAtom.effectiveDate ? new Date(settingAtom.effectiveDate) : null
  );

  const updateBreadcrumb = useCallback(() => {
    setBreadcrumb((prev) => [
      { name: "Leave Management", href: "/" },
      { name: "Setup", href: "/setup" },
      { name: "Effective Date", href: "/setup/effective-date" },
    ]);
  }, [setBreadcrumb]);

  useEffect(() => {
    updateBreadcrumb();
    setActiveStep({ id: 1, label: "Effective Date" });
  }, [updateBreadcrumb]);

  const handleNext = async () => {
    if (date) {
      const currentDate = new Date();
      if (date < currentDate) {
        toast.error("The selected date cannot be earlier than today.", {
          description: "Please select a date on or after today.",
        });
        return;
      }

      try {
        const tokens = localStorage.getItem("resolve-tokens");
        if (!tokens) return;

        const { token } = JSON.parse(tokens);
        const response = await fetch("/api/organisation", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            effectiveDate: date,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update effective date");
        }

        await response.json();
        mutate("/api/organisation"); // Refresh the organisation data
        router.push("/setup/leave-types");
      } catch (error) {
        console.error("Error updating effective date:", error);
        toast.error("Failed to update effective date");
      }
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
              Set Effective Date
            </Text>

            <Button
              onClick={handleNext}
              disabled={!date}
              icon={FiChevronRight}
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

        <div className="bg-white rounded-lg shadow-sm h-[80%] md:h-[90%]">
          <div className="flex flex-col items-center justify-center h-full text-center p-2 md:p-8">
            <Text
              fontWeight={600}
              fontSize={{ base: "xl", md: "3xl" }}
              className="text-left"
            >
              Set Date
            </Text>
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#676A6C"
              className="mt-2"
            >
              The leave management module will be operational from this date
              once it&apos;s set up.
            </Text>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  mt={4}
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? (
                    `${new Date(date).toLocaleDateString()}`
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={(value: Date | undefined) => setDate(value || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </FadeIn.Container>
  );
}
