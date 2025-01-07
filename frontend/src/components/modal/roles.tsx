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
import { Role } from "@/lib/types";
import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { Button } from "../core/button";
import { columns } from "../role/role-columns";
import { RolesTable } from "../role/role-table";
import useSWR from "swr";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (roles: { id: number; name: string }[]) => void;
  assignedTo: { id: number; name: string }[];
}

const fetcher = (url: string) => {
  const tokens = localStorage.getItem("resolve-tokens");
  if (!tokens) return;

  const { token } = JSON.parse(tokens);

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};

export default function RolesModal({
  isOpen,
  onClose,
  onConfirm,
  assignedTo,
}: Props) {
  const [selectedUsers, setSelectedUsers] =
    useState<{ id: number; name: string }[]>(assignedTo);
  const [clearSelectionFlag, setClearSelectionFlag] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const {
    data: roles,
    error,
    isLoading,
  } = useSWR("/api/roles", fetcher) as {
    data: Role[];
    error: any;
    isLoading: boolean;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredRoles = roles?.filter((role) =>
    role.roleName.toLowerCase().includes(search.toLowerCase())
  );

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
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Assign to Roles</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>
              <Flex
                direction={{ base: "column", md: "row" }}
                alignItems="center"
                gap={3}
                mt={3}
              >
                <InputGroup
                  w={{ base: "100%", md: "80%" }}
                  bg="white"
                  borderRadius="12px"
                >
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                  >
                    <Icon as={FaSearch} color="#6D7B88" fontSize={20} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search for roles"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    _focus={{ borderColor: "transparent" }}
                    _focusVisible={{
                      outline: "none",
                    }}
                  />
                </InputGroup>

                <Button
                  variant="outline"
                  icon={CiFilter}
                  iconPosition="right"
                  w={{ base: "100%", md: "auto" }}
                >
                  {filters.length > 0
                    ? `(${filters.length}) Filters applied`
                    : "Apply Filters"}
                </Button>
              </Flex>

              <Flex
                mt={5}
                w="100%"
                h="30vh"
                overflowY="auto"
                border="1px solid #08705C"
                borderRadius="12px"
              >
                <RolesTable
                  data={filteredRoles || []}
                  columns={columns}
                  setSelectedRoles={setSelectedUsers}
                  clearSelection={clearSelectionFlag}
                  selectedRoles={selectedUsers}
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
                ({selectedUsers.length}) Roles selected
              </Text>

              <Button
                onClick={() => onConfirm(selectedUsers)}
                py={3}
                icon={IoCheckmark}
                iconPosition="right"
              >
                Assign to Roles
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
                Assign to Roles
              </DialogTitle>
            </DialogHeader>

            <div className="p-4">
              <Flex direction="row" alignItems="center" gap={3}>
                <InputGroup w="80%" bg="white" borderRadius="12px">
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                  >
                    <Icon as={FaSearch} color="#6D7B88" fontSize={20} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search for roles"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    _focus={{ borderColor: "transparent" }}
                    _focusVisible={{
                      outline: "none",
                    }}
                  />
                </InputGroup>

                <Button variant="outline" icon={CiFilter} iconPosition="right">
                  {filters.length > 0
                    ? `(${filters.length}) Filters applied`
                    : "Apply Filters"}
                </Button>
              </Flex>

              <Flex
                mt={5}
                w="100%"
                h="50vh"
                overflowY="auto"
                border="1px solid #08705C"
                borderRadius="12px"
              >
                <RolesTable
                  data={filteredRoles || []}
                  columns={columns}
                  setSelectedRoles={setSelectedUsers}
                  clearSelection={clearSelectionFlag}
                  selectedRoles={selectedUsers}
                />
              </Flex>
            </div>

            <DialogFooter className="flex flex-row items-center justify-between w-full">
              <Text fontSize="xl" color="#0F1216" fontWeight={600} w="50%">
                ({selectedUsers.length}) Roles selected
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
                  Assign to Roles
                </Button>
              </Flex>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
