import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  heading: string;
}

export default function SuccessModal({ isOpen, onClose, heading }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onClose={onClose}>
          <DrawerContent>
            <DrawerHeader>
              {/* <DrawerTitle>{heading}</DrawerTitle> */}
              <DrawerDescription className="flex flex-col justify-center items-center">
                <Image src="/assets/success.gif" alt="success" width="50%" />
                <DrawerTitle className="text-center text-black mb-6">
                  {heading}
                </DrawerTitle>
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal
          size={{ base: "md", md: "xl" }}
          isOpen={isOpen}
          onClose={onClose}
          isCentered
        >
          <div className="hidden md:inline-block">
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
                mb={6}
              >
                <Image src="/assets/success.gif" alt="success" width="50%" />
                <Text fontSize="2xl" fontWeight={600}>
                  {heading}
                </Text>
              </ModalBody>
            </ModalContent>
          </div>
        </Modal>
      )}
    </>
  );
}
