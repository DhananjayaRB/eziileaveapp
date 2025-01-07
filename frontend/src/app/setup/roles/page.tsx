"use client";

import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { setupStepState } from "@/atoms/setup-atom";
import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { Role } from "@/lib/types";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ChevronLeftIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import useSWR from "swr";

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

export default function Page() {
  const [activeStep, setActiveStep] = useRecoilState(setupStepState);
  const [_, setBreadcrumb] = useRecoilState(breadcrumbState);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const {
    data: roles,
    error,
    isLoading,
  } = useSWR("/api/roles", fetcher) as {
    data: Role[];
    error: any;
    isLoading: boolean;
  };

  const filteredRoles = Array.isArray(roles) && roles.length > 0
    ? roles.filter(role => role.roleName.toLowerCase().includes(searchQuery.toLowerCase()))
  : [];

  const updateBreadcrumb = useCallback(() => {
    setBreadcrumb((prev) => [
      { name: "Leave Management", href: "/" },
      { name: "Setup", href: "/setup" },
      { name: "Roles", href: "/setup/roles" },
    ]);
  }, [setBreadcrumb]);

  useEffect(() => {
    updateBreadcrumb();
    setActiveStep({ id: 5, label: "Roles" });
  }, [updateBreadcrumb]);

  const handleNext = () => {
    if (filteredRoles?.length === 0) {
      toast.error("Create a role before proceeding");
      return;
    }
    router.push("/setup/workflows");
  };

  const handlePrevious = () => {
    router.back();
  };

  return (
    <FadeIn.Container className="bg-white md:bg-[#F2F3F3] h-full">
      <div className="p-4 md:px-6 md:py-8 h-full">
        <FadeIn.Item>
          <div className="flex items-center space-x-3 mb-4 pb-4 md:pb-0 border-b border-[#F2F3F3] md:border-b-0">
            <Button
              bg="#fff"
              h="44px"
              w="44px"
              p={2}
              _hover={{ bg: "#fff" }}
              display={{ base: "inline", md: "none" }}
              onClick={() => router.back()}
            >
              <ChevronLeftIcon className="h-6 w-6 md:h-5 md:w-5 text-[#000000] md:text-[#9A9B9D]" />
            </Button>
            <div className="flex items-center justify-between w-full">
              <Flex
                flexDir="row"
                gap={5}
                alignItems="center"
                justifyContent={{ base: "space-between", md: "normal" }}
                w={{ base: "100%", md: "50%" }}
              >
                <Text
                  fontWeight={600}
                  fontSize={{ base: "xl", md: "3xl" }}
                  className="text-left"
                >
                  Roles
                </Text>
              </Flex>

              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="outline"
                  icon={FiChevronLeft}
                  iconPosition="right"
                  onClick={handlePrevious}
                  py={3}
                >
                  Previous
                </Button>
                <Button
                  variant="solid"
                  icon={FiChevronRight}
                  iconPosition="right"
                  onClick={handleNext}
                  py={3}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </FadeIn.Item>

        {/* Main Content */}
        <FadeIn.Item>
          <div className="flex flex-row items-center space-x-3">
            <InputGroup w={{ base: "100%", md: "30%" }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="#6D7B88" className="w-5 h-5" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search for Roles"
                bg="white"
                borderRadius="10px"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Button
              variant="solid"
              py={3}
              icon={FiPlus}
              iconPosition="right"
              display={{ base: "none", md: "inline" }}
              onClick={() => router.push("/setup/create-role")}
            >
              Create Role
            </Button>
          </div>
        </FadeIn.Item>

        <FadeIn.Item>
          <div className="mt-6 bg-white rounded-lg p-2">
            {isLoading ? (
              <Text>Loading roles...</Text>
            ) : error ? (
              <Text>Error loading roles</Text>
            ) : (
              <div>
                {roles.length > 0 ? (
                  <div>
                    <Table
                      variant="simple"
                      border="1px solid #F2F5F8"
                      display={{ base: "none", md: "table" }}
                    >
                      <Thead bg="#F2F5F8">
                        <Tr>
                          <Th
                            color="#333333"
                            fontWeight={700}
                            fontSize={{ base: "14px", md: "16px" }}
                            textTransform="capitalize"
                          >
                            Roles
                          </Th>
                          <Th
                            color="#333333"
                            fontWeight={700}
                            fontSize={{ base: "14px" }}
                            textTransform="capitalize"
                          >
                            Assigned To
                          </Th>
                          <Th
                            color="#333333"
                            fontWeight={700}
                            fontSize={{ base: "14px" }}
                            textTransform="capitalize"
                          >
                            Created By
                          </Th>
                          <Th
                            color="#333333"
                            fontWeight={700}
                            fontSize={{ base: "14px" }}
                            textTransform="capitalize"
                          ></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredRoles?.map((role) => (
                          <Tr key={role.id}>
                            <Td>{role.roleName}</Td>
                            <Td>{role.assignedTo.length} Employees</Td>
                            <Td>{role.createdBy?.name}</Td>
                            <Td>
                              <Button
                                variant="outline"
                                icon={FaChevronRight}
                                iconPosition="right"
                                onClick={() =>
                                  router.push(`/setup/roles/${role.id}`)
                                }
                              >
                                Edit
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>

                    <div className="flex flex-col space-y-4 md:hidden">
                      {filteredRoles?.map((role) => (
                        <Flex
                          onClick={() => router.push(`/setup/roles/${role.id}`)}
                          direction="row"
                          key={role.id}
                          alignItems="center"
                          justifyContent="space-between"
                          borderBottom="1px solid #E6E6E7"
                          py={5}
                          px={3}
                        >
                          <Flex direction="column">
                            <Text>{role.roleName}</Text>
                            <Text color="#637587">
                              {role.assignedTo.length} Employees
                            </Text>
                          </Flex>

                          <Flex direction="row" alignItems="center">
                            <Text color="#637587">
                              By {role.createdBy?.name}
                            </Text>
                            <FiChevronRight className="w-8 h-8" />
                          </Flex>
                        </Flex>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px] md:h-[350px]">
                    <Text>No roles have been created yet.</Text>
                  </div>
                )}
              </div>
            )}
          </div>
        </FadeIn.Item>

        <FadeIn.Item>
          <div className="flex flex-row items-center justify-between md:hidden">
            <Button
              variant="outline"
              icon={FiChevronRight}
              iconPosition="right"
              onClick={handleNext}
              py={3}
              w="49%"
            >
              Next
            </Button>
            <Button
              variant="solid"
              py={3}
              icon={FiPlus}
              iconPosition="right"
              w="49%"
              onClick={() => router.push("/setup/create-role")}
            >
              Create Role
            </Button>
          </div>
        </FadeIn.Item>
      </div>
    </FadeIn.Container>
  );
}
