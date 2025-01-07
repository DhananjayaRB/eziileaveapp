"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ApplyForCompOffForm } from "../apply/comp-off-form";
import { CompOffForm } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyForCompOffModal({ isOpen, onClose }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compOffForm, setCompOffForm] = useState<CompOffForm>({
    leaveType: "",
    date: "",
    fromTime: "",
    toTime: "",
    reasonForCompOff: "",
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  async function onSubmit() {
    setLoading(true);
    try {
      // API call
      console.log("Submitting comp-off form: ", compOffForm);
      onClose();
    } catch (error) {
      console.error("Error submitting comp-off form: ", error);
    } finally {
      setLoading(false);
    }
  }

  function onDiscard() {
    setCompOffForm({
      leaveType: "",
      date: "",
      fromTime: "",
      toTime: "",
      reasonForCompOff: "",
    });
    onClose();
  }

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onClose={onClose}>
          <DrawerContent className="h-[90%]">
            <DrawerTitle className="text-center text-black my-6 text-2xl">
              Apply For Comp-off
            </DrawerTitle>
            <DrawerDescription className="flex flex-col justify-center items-center h-full overflow-y-auto">
              <ApplyForCompOffForm
                loading={loading}
                // setLoading={setLoading}
                onSubmit={onSubmit}
                onDiscard={onDiscard}
                data={compOffForm}
                setData={setCompOffForm}
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
              Apply For Comp-off
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody className="space-y-6">
              <ApplyForCompOffForm
                loading={loading}
                // setLoading={setLoading}
                onSubmit={onSubmit}
                onDiscard={onDiscard}
                data={compOffForm}
                setData={setCompOffForm}
              />
            </ModalBody>
            <ModalFooter>{/* Optional footer content */}</ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
