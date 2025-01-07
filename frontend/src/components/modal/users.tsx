"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useResolveAPI } from "@/hooks/resolve";
import { AssignedTo } from "@/lib/types";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import { Button } from "../core/button";
import { columns } from "../leave-variants/users-columns";
import { UsersTable } from "../leave-variants/users-table";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (users: AssignedTo[]) => void;
  assignedTo: AssignedTo[];
}

export default function UsersModal({
  isOpen,
  onClose,
  onConfirm,
  assignedTo,
}: Props) {
  const { employees } = useResolveAPI();
  const [selectedUsers, setSelectedUsers] = useState<AssignedTo[]>(assignedTo);
  const [clearSelectionFlag, setClearSelectionFlag] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const clearSelection = () => {
    setSelectedUsers([]);
    setClearSelectionFlag(true);
    // Reset the flag after a short delay
    setTimeout(() => setClearSelectionFlag(false), 100);
  };

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onClose={onClose}>
          <DrawerContent className="h-[90vh]">
            <DrawerHeader>
              <DrawerTitle>Assign to Employees</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>
              <Flex
                w="100%"
                h="60vh"
                p={3}
                border="1px solid #08705C"
                borderRadius="12px"
              >
                <UsersTable
                  data={employees}
                  columns={columns}
                  setSelectedUsers={setSelectedUsers}
                  clearSelection={clearSelectionFlag}
                  selectedUsers={assignedTo}
                />
              </Flex>
            </DrawerDescription>
            <DrawerFooter>
              <Text
                textAlign="center"
                fontWeight={600}
                fontSize="lg"
                color="#0F1216"
              >
                ({selectedUsers.length}) Employees selected
              </Text>

              <Button
                onClick={() => onConfirm(selectedUsers)}
                py={3}
                icon={IoCheckmark}
                iconPosition="right"
              >
                Assign to Employees
              </Button>
              <DrawerClose>
                <Button
                  py={3}
                  variant="outline"
                  onClick={clearSelection}
                  w="100%"
                >
                  Clear Selection
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="bg-[#F2F3F3] sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Assign to Employees
              </DialogTitle>
            </DialogHeader>

            <div className="p-4">
              <Flex
                w="100%"
                h="55vh"
                p={3}
                border="1px solid #08705C"
                borderRadius="12px"
              >
                <UsersTable
                  data={employees}
                  columns={columns}
                  setSelectedUsers={setSelectedUsers}
                  clearSelection={clearSelectionFlag}
                  selectedUsers={assignedTo}
                />
              </Flex>
            </div>

            <DialogFooter className="flex flex-row items-center justify-between w-full">
              <Text fontSize="xl" color="#0F1216" fontWeight={600} w="50%">
                ({selectedUsers.length}) Employees selected
              </Text>
              <Flex gap={3}>
                <Button
                  py={3}
                  variant="outline"
                  onClick={clearSelection}
                  fontSize={18}
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={() => onConfirm(selectedUsers)}
                  py={3}
                  icon={IoCheckmark}
                  iconPosition="right"
                >
                  Assign to Employees
                </Button>
              </Flex>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
