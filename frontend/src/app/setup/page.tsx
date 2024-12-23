"use client";

import { settingsAtom } from "@/atoms/settings-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import {
  ProgressCircle,
  ProgressLine,
} from "@/components/core/progress-indicator";
import { Progress } from "@/components/ui/progress";
import { Text } from "@chakra-ui/react";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { useRecoilState } from "recoil";

export default function Page() {
  const [activeStep, _] = useRecoilState(setupStepState);
  const router = useRouter();
  const [setting] = useRecoilState(settingsAtom);

  const showProgress = () => {
    const percentage = parseInt(setting.setupPercentage);

    const calculateTimeRequired = (percentage: number) => {
      const totalTime = 20;
      const remainingPercentage = 100 - percentage;
      const timePerPercent = totalTime / 100;
      return Math.round(remainingPercentage * timePerPercent);
    };

    const timeRequired = calculateTimeRequired(percentage);

    if (percentage === 0) {
      return (
        <div className="flex items-center justify-center gap-2 mb-8 border border-[#E6E6E7] px-4 py-2 rounded-full">
          <Clock className="w-5 h-5 text-[#676A6C]" />
          <span className="text-[#676A6C]">15-20 mins required</span>
        </div>
      );
    }

    if (percentage > 0 && percentage < 100) {
      return (
        <div className="flex flex-col items-center gap-2 mb-8 px-4 py-2 rounded-full w-full">
          <Progress value={percentage} className="w-full " />
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="text-[#676A6C]">{percentage}% Completed</span>
            <span className="text-[#676A6C]">{timeRequired} mins left</span>
          </div>
        </div>
      );
    }
  };

  return (
    <FadeIn.Container className="bg-white md:bg-[#F2F3F3] h-full">
      <div className="p-6 h-full">
        <FadeIn.Item>
          <Text
            fontWeight={600}
            fontSize="3xl"
            className="mb-8 text-center md:text-left"
          >
            Leave Management
          </Text>
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

        <div className="bg-white rounded-lg shadow-sm h-auto md:h-[85%]">
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FadeIn.Item>
              <h2 className="text-2xl font-bold">Let's Get Started</h2>
            </FadeIn.Item>

            <FadeIn.Item>
              <Text className="text-[#676A6C] mb-6 max-w-xl mt-5">
                We will take you through a thorough setup where you can create a
                highly customised leave plan according to your leave policy
              </Text>
            </FadeIn.Item>

            <div className="w-full max-w-xl">
              <FadeIn.Item>{showProgress()}</FadeIn.Item>
            </div>

            <FadeIn.Item>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                {parseInt(setting.setupPercentage) > 0 ? (
                  <Button
                    icon={FiChevronRight}
                    iconPosition="right"
                    py={3}
                    onClick={() => {
                      router.push("/setup/effective-date");
                    }}
                  >
                    Continue Setup
                  </Button>
                ) : (
                  <Button
                    icon={FiChevronRight}
                    iconPosition="right"
                    py={3}
                    onClick={() => {
                      router.push("/setup/effective-date");
                    }}
                  >
                    Start Setup
                  </Button>
                )}

                {/* <Button
                  variant="outline"
                  icon={MdOutlineFileUpload}
                  iconPosition="right"
                  className="w-full md:w-auto order-2 md:order-1"
                >
                  Import Leave data
                </Button> */}
              </div>
            </FadeIn.Item>
          </div>
        </div>
      </div>
    </FadeIn.Container>
  );
}
