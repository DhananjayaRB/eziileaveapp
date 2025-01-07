"use client";

import { settingsAtom } from "@/atoms/settings-atom";
import * as FadeIn from "@/components/animation";
import { ApplyButton } from "@/components/employee/apply-button";
import { ApplyForCompOffModal } from "@/components/modal/apply-for-comp-off";
import { ApplyForLeaveModal } from "@/components/modal/apply-for-leave";
import { ApplyForPtoModal } from "@/components/modal/apply-for-pto";
import { Text, useDisclosure } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

export function EmployeeHome() {
  const setting = useRecoilValue(settingsAtom);

  const isCompOffEnabled = setting.compOff.isEnabled;
  const isPTOEnabled = setting.pto.isEnabled;

  const {
    isOpen: isApplyForLeaveModalOpen,
    onOpen: onApplyForLeaveModalOpen,
    onClose: onApplyForLeaveModalClose,
  } = useDisclosure();

  const {
    isOpen: isApplyForCompOffModalOpen,
    onOpen: onApplyForCompOffModalOpen,
    onClose: onApplyForCompOffModalClose,
  } = useDisclosure();

  const {
    isOpen: isApplyForPtoModalOpen,
    onOpen: onApplyForPtoModalOpen,
    onClose: onApplyForPtoModalClose,
  } = useDisclosure();

  return (
    <>
      <FadeIn.Container className="bg-white md:bg-[#F2F3F3] h-full">
        <div className="p-4 md:p-8 h-full space-y-5">
          {(isCompOffEnabled || isPTOEnabled) && (
            <FadeIn.Item>
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-5 items-center justify-evenly">
                <ApplyButton mode="Leave" onClick={onApplyForLeaveModalOpen} />
                {isCompOffEnabled && (
                  <ApplyButton
                    mode="Comp-Off"
                    onClick={onApplyForCompOffModalOpen}
                  />
                )}
                {isPTOEnabled && (
                  <ApplyButton mode="PTO" onClick={onApplyForPtoModalOpen} />
                )}
              </div>
            </FadeIn.Item>
          )}

          {/* Leave Balance */}
          <FadeIn.Item>
            <div>
              <Text fontSize={{ base: "14px", md: "16px", lg: "18px" }}>
                Leave Balance
              </Text>
            </div>
          </FadeIn.Item>
        </div>
      </FadeIn.Container>

      <ApplyForLeaveModal
        isOpen={isApplyForLeaveModalOpen}
        onClose={onApplyForLeaveModalClose}
      />
      <ApplyForCompOffModal
        isOpen={isApplyForCompOffModalOpen}
        onClose={onApplyForCompOffModalClose}
      />
      <ApplyForPtoModal
        isOpen={isApplyForPtoModalOpen}
        onClose={onApplyForPtoModalClose}
      />
    </>
  );
}
