"use client";

import { settingsAtom } from "@/atoms/settings-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Box, Text, VStack } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import {
  returnAdminSetupSteps,
  returnEmployeeSetupSteps,
  SetupStepItem,
  StepItem,
} from "./utils";

interface Props {
  role: string;
}

export function RightMenu({ role }: Props) {
  const [activeStep, setActiveStep] = useRecoilState(setupStepState);
  const [setting] = useRecoilState(settingsAtom);
  const router = useRouter();
  const pathname = usePathname();

  const adminSetupSteps = returnAdminSetupSteps(setting);
  const employeeSteps = returnEmployeeSetupSteps(setting);

  const inSetupMode = setting.setupPercentage !== "100";

  const adminClick = (id: number) => {
    setActiveStep(adminSetupSteps[id - 1]);

    if (adminSetupSteps[id - 1].link) {
      router.push(`${adminSetupSteps[id - 1].link}`);
    }
  };

  const onClick = (id: number) => {
    if (employeeSteps[id - 1].link) {
      router.push(`${employeeSteps[id - 1].link}`);
    }
  };

  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <Box className="p-3.5" bg="white" rounded="md">
          {role === "admin" && (
            <VStack align="stretch" spacing="6">
              {inSetupMode && (
                <>
                  <Text color="#0F1216" fontWeight={700} fontSize="lg">
                    Setup
                  </Text>

                  <VStack align="stretch" spacing="2">
                    {adminSetupSteps.map((step) => (
                      <SetupStepItem
                        steps={adminSetupSteps}
                        key={step.id}
                        step={step}
                        isCompleted={
                          adminSetupSteps.findIndex(
                            (s) => s.label === activeStep.label
                          ) >
                          step.id - 1
                        }
                        isActive={step.label === activeStep.label}
                        onClick={() => adminClick(step.id)}
                      />
                    ))}
                  </VStack>
                </>
              )}
            </VStack>
          )}

          {role === "employee" && (
            <VStack align="stretch" spacing="2">
              {employeeSteps.map((step) => (
                <StepItem
                  key={step.id}
                  step={step}
                  isActive={pathname === step.link}
                  onClick={() => onClick(step.id)}
                />
              ))}
            </VStack>
          )}
        </Box>
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
