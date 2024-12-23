import {
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { FaTrash } from "react-icons/fa";
import { Button } from "../core/button";
import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  heading: string;
  description: string;
  icon?: IconType | LucideIcon;
  onConfirm: () => void;
}

export default function WarningModal({
  isOpen,
  onClose,
  heading,
  description,
  icon,
  onConfirm,
}: Props) {
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
              <DrawerTitle>{heading}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button
                onClick={onConfirm}
                py={3}
                bg="#EDA145"
                _hover={{ bg: "#EDA14580" }}
              >
                <Flex gap={2}>
                  <Text fontSize={18}>Reject</Text>
                  <Icon as={FaTrash} fontSize={20} />
                </Flex>
              </Button>
              <DrawerClose>
                <Button py={3} variant="outline" w="100%">
                  Go Back
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal
          size={{ base: "md", md: "2xl" }}
          isOpen={isOpen}
          onClose={onClose}
          isCentered
        >
          <div className="hidden md:inline-block">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <Flex alignItems="center" gap={2}>
                  {icon && <Icon as={icon} />}
                  <Text fontSize="2xl" fontWeight={600}>
                    {heading}
                  </Text>
                </Flex>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>{description}</ModalBody>

              <ModalFooter gap={4}>
                <Button
                  py={3}
                  variant="outline"
                  onClick={onClose}
                  fontSize={18}
                >
                  Go Back
                </Button>
                <Button
                  onClick={onConfirm}
                  py={3}
                  bg="#EDA145"
                  _hover={{ bg: "#EDA14580" }}
                >
                  <Flex gap={2}>
                    <Text fontSize={18}>Reject</Text>
                    <Icon as={FaTrash} fontSize={20} />
                  </Flex>
                </Button>
              </ModalFooter>
            </ModalContent>
          </div>
        </Modal>
      )}
    </>
  );
}
