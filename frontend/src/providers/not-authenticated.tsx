"use client";

import { Text } from "@chakra-ui/react";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { FaChevronRight } from "react-icons/fa";
import { TbSettingsExclamation } from "react-icons/tb";

export function NotAuthenticated() {
  const handleDevelopmentClick = () => {
    const tokenData = {
      orgId: Math.random().toString(36).substring(2, 15),
      userId: Math.random().toString(36).substring(2, 15),
      role: "admin",
      email: "admin@resolve.com",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiI2MyIsInVzZXJfaWQiOiIxIiwicm9sZV9pZCI6IjI4OSIsInVzZXJfdHlwZV9pZCI6IjMiLCJuYmYiOjE3Mzg3MzIyNjgsImV4cCI6MTc0MDk2MDAwMCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDMifQ.9Cjzcc6Ks72-Fqu1K9fykUMu_Y-GycmzMt4VJoWZk3k",
    };

    // ORG - 63 | 70
    // ROLE_ID - 289 | 300

    localStorage.setItem("resolve-tokens", JSON.stringify(tokenData));
    window.location.reload();
    // sessionStorage.setItem("resolve-tokens", JSON.stringify(tokenData));
  };

  return (
    <FadeIn.Container className="h-screen w-screen bg-white flex flex-col items-center justify-center">
      <FadeIn.Item>
        <Text
          fontWeight={600}
          fontSize="3xl"
          className="text-center md:text-left"
        >
          You&apos;re not authenticated
        </Text>
      </FadeIn.Item>

      <FadeIn.Item>
        <Text className="text-[#676A6C] mb-5 max-w-xl mt-5">
          Login to continue using the application
        </Text>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="w-full flex items-center space-x-5">
          <Button icon={FaChevronRight} iconPosition="right" px={5} py={3}>
            Login
          </Button>
          <Button
            variant="outline"
            icon={TbSettingsExclamation}
            iconPosition="right"
            px={5}
            py={3}
            onClick={handleDevelopmentClick}
          >
            Development
          </Button>
        </div>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
