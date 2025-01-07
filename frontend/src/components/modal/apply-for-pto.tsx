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
import { ApplyForPtoForm, } from "../apply/pto-form";
import { PtoForm } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
export function ApplyForPtoModal({ isOpen, onClose }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  const [loading, setLoading] = useState(false);
    const [ptoData, setPtoData] = useState<PtoForm>({
      // leaveType: "",
      date: "",
      fromTime: "",
      toTime: "",
      description: "",
      document:[],
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
    setLoading(true);
    try {
      // const tokens = localStorage.getItem("resolve-tokens");
      // if (!tokens) return;

      // const { token } = JSON.parse(tokens);
      // const response = await fetch("/api/organisation", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // if (!response.ok) throw new Error("Failed to Save");
      // window.location.reload();
      console.log("Submitting Pto form: ", ptoData);
      onClose();
    } catch (error) {
      console.error("Error submitting comp-off form: ", error);
    } finally {
      setLoading(false);
    }
  }

  function onDiscard() {
    setPtoData({
      // leaveType: "",
      date: "",
      fromTime: "",
      toTime: "",
      description: "",
      document:[],
    });
    onClose();
  }

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onClose={onClose}>
          <DrawerContent className="h-[90%]">
            <DrawerTitle className="text-center text-black my-6 text-2xl">
              Apply For PTO
            </DrawerTitle>
            <DrawerDescription className="flex flex-col justify-center items-center h-full overflow-y-auto"></DrawerDescription>
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
              Apply For PTO
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>{/* <Lorem count={2} /> */}
              <ApplyForPtoForm
                loading={loading}
                // setLoading={setLoading}
                onSubmit={onSubmit}
                onDiscard={onDiscard}
                data={ptoData}
                setData={setPtoData}
              />
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
