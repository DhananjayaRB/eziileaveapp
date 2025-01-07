"use client";

import * as FadeIn from "@/components/animation";
import { Text } from "@chakra-ui/react";

interface Props {
  message: string;
}

export function Error({ message }: Props) {
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
              <h2 className="text-2xl font-bold">{message}</h2>
            </FadeIn.Item>
          </div>
        </div>
      </div>
    </FadeIn.Container>
  );
}
