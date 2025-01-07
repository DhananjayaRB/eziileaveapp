"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { LeaveForm } from "@/lib/types";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ApplyForLeaveForm } from "../apply/leave-form";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyForLeaveModal({ isOpen, onClose }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaveForm, setLeaveForm] = useState<LeaveForm>({
    leaveType: "",
    startDate: {
      date: "",
      halfDay: false,
      whichHalf: "",
    },
    endDate: {
      date: "",
      halfDay: false,
      whichHalf: "",
    },
    behalfOfSomeoneElse: {
      isSelected: false,
      employee: undefined,
    },
    reasonForLeave: "",
    description: "",
    supportingDocuments: [],
    assignTasks: [],
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  async function onSubmit() {
    console.log(leaveForm);
  }

  function onDiscard() {
    onClose();
  }

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onClose={onClose}>
          <DrawerContent className="h-[90%]">
            <DrawerTitle className="text-center text-black my-6 text-2xl">
              Apply For Leave
            </DrawerTitle>
            <DrawerDescription className="flex flex-col px-6 h-full overflow-y-auto">
              <ApplyForLeaveForm
                data={leaveForm}
                setData={setLeaveForm}
                loading={loading}
                onSubmit={onSubmit}
                onDiscard={onDiscard}
              />
            </DrawerDescription>
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay />
          <ModalContent borderRadius="10px">
            <ModalHeader
              fontSize={{ md: "2xl", lg: "3xl" }}
              fontWeight={700}
              borderBottom="1px solid #D1D9E2"
              mb={5}
            >
              Apply For Leave
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ApplyForLeaveForm
                data={leaveForm}
                setData={setLeaveForm}
                loading={loading}
                onSubmit={onSubmit}
                onDiscard={onDiscard}
              />
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
