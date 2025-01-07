"use client";

import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";

interface Props {
  handleSetup: () => void;
  loading: boolean;
}

export function NotSetup({ handleSetup, loading }: Props) {
  const router = useRouter();

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

        <div className="bg-white rounded-lg shadow-sm h-auto md:h-[85%]">
          <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
            <FadeIn.Item>
              <h2 className="text-2xl font-bold">
                This module has not been enabled for this organisation
              </h2>
            </FadeIn.Item>

            <FadeIn.Item>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <Button
                  py={3}
                  icon={FiChevronRight}
                  iconPosition="right"
                  className="w-full md:w-auto order-1 md:order-2"
                  onClick={handleSetup}
                  isLoading={loading}
                >
                  Enable Module
                </Button>
              </div>
            </FadeIn.Item>
          </div>
        </div>
      </div>
    </FadeIn.Container>
  );
}
