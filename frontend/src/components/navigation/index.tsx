"use client";

import {
  Avatar,
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  FlexProps,
  BoxProps,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import { GoCalendar } from "react-icons/go";
import { RightMenu } from "./right-menu/right-menu";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { setupStepState } from "@/atoms/setup-atom";
import Link from "next/link";
import { breadcrumbState } from "@/atoms/breadcrumb-atom";
import { User, userAtom } from "@/atoms/user-atom";
import { returnEmployeeSetupSteps } from "./right-menu/utils";
import { settingsAtom } from "@/atoms/settings-atom";
import { returnAdminSetupSteps } from "./right-menu/utils";

interface SidebarProps extends BoxProps {
  onClose: () => void;
  user: User | null;
}

interface LinkItemProps {
  name: string;
  icon: IconType;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavItem = ({ icon, children, isActive, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="/"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        justify="center"
        p="4"
        role="group"
        direction="column"
        cursor="pointer"
        transition="all 0.4s ease"
        _hover={{
          bgGradient:
            "linear(to-r, #FFFFFF00 20%, #2E75C733 80%, #FFFFFF00 100%)",
          backgroundSize: "200% 100%",
          animation: "gradientShift 3s ease infinite",
          color: "white",
        }}
        sx={{
          "@keyframes gradientShift": {
            "0%": { backgroundPosition: "100% 0%" },
            "50%": { backgroundPosition: "0% 0%" },
            "100%": { backgroundPosition: "100% 0%" },
          },
        }}
        borderLeft={isActive ? "5px solid #659CDB" : "none"}
        bgGradient={
          isActive ? "linear(to-l,#FFFFFF00 10%, #2E75C733 80%)" : "transparent"
        }
        className="space-y-2"
        color="white"
        {...rest}
      >
        <Icon
          fontSize="20"
          _groupHover={{
            color: "white",
          }}
          as={icon}
          strokeWidth={1}
          color="inherit"
        />
        <Text fontSize="xs" color="inherit" fontWeight={600}>
          {children}
        </Text>
      </Flex>
    </Box>
  );
};

const LinkItems: Array<LinkItemProps> = [{ name: "Leave", icon: GoCalendar }];

const leaveSubItems = [
  { id: 1, label: "Effective Date", link: "/setup/effective-date" },
  { id: 2, label: "Leave Types", link: "/setup/leave-types" },
  { id: 3, label: "Comp off", link: "/setup/comp-off" },
  { id: 4, label: "PTO", link: "/setup/pto" },
  { id: 5, label: "Roles", link: "/setup/roles" },
  { id: 6, label: "Workflow", link: "/setup/workflows" },
  { id: 7, label: "Combos + Balance", link: "" },
  { id: 8, label: "Leave Planning", link: "" },
];

const SidebarContent = ({ onClose, user, ...rest }: SidebarProps) => {
  const pathname = usePathname();
  const userRole = user?.role || "";

  return (
    <Flex
      className="w-80"
      top="5rem"
      pos="fixed"
      h="calc(100vh - 5rem)"
      display={{ base: "none", md: "flex" }}
    >
      <Box
        transition="3s ease"
        bg="#0F1216"
        borderRight="1px"
        borderRightColor="#CCCDCE"
        className="w-20"
        pos="fixed"
        h="calc(100vh - 5rem)"
        top="5rem"
        {...rest}
      >
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} isActive={pathname === "/"}>
            {link.name}
          </NavItem>
        ))}
      </Box>

      <Box
        ml={{ base: 0, md: "5rem" }}
        width="100%"
        borderRightWidth="0.3px"
        borderTopWidth="0.3px"
        borderBottomWidth="0.3px"
        borderColor="#B9B9B9"
        bg="white"
      >
        <RightMenu role={userRole} />
      </Box>
    </Flex>
  );
};

const MobileMenuContent = ({
  onClose,
  user,
}: {
  onClose: () => void;
  user: User | null;
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>("Leave");
  const [activeStep, setActiveStep] = useRecoilState(setupStepState);
  const setting = useRecoilValue(settingsAtom);
  const router = useRouter();
  const pathname = usePathname();
  const userRole = user?.role || "";

  const inSetupMode = setting.setupPercentage !== "100";
  const adminSteps = returnAdminSetupSteps(setting);
  const employeeSteps = returnEmployeeSetupSteps(setting);

  return (
    <Box>
      <DrawerHeader borderBottomWidth="1px" px={4}>
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="700">
            Menu
          </Text>
          <DrawerCloseButton position="static" />
        </Flex>
      </DrawerHeader>

      <Box p={4}>
        <Flex
          align="center"
          // mb={4}
          onClick={() =>
            setExpandedItem(expandedItem === "Leave" ? null : "Leave")
          }
          p={3}
          borderRadius="8px"
          bg="#08705C1F"
        >
          <Icon as={GoCalendar} mr={3} strokeWidth={1} />
          <Text color="#08705C" fontWeight={700} fontSize={"md"}>
            Leave
          </Text>
        </Flex>

        {expandedItem === "Leave" && (
          <>
            {userRole === "admin" && inSetupMode && (
              <Box pt={2} pl={6} ml={3} borderLeft="2px" borderColor="#CCCDCE">
                {adminSteps.map((item) => (
                  <Text
                    key={item.id}
                    py={2}
                    fontSize="sm"
                    color={activeStep.id === item.id ? "#08705C" : "gray.600"}
                    fontWeight={activeStep.id === item.id ? "bold" : "normal"}
                    bg={activeStep.id === item.id ? "#08705C1F" : "transparent"}
                    borderRadius={activeStep.id === item.id ? "md" : "none"}
                    px={2}
                    _hover={{ color: "teal.500" }}
                    cursor="pointer"
                    onClick={() => {
                      setActiveStep(item);
                      onClose();

                      if (item.link) {
                        router.push(`${item.link}`);
                      }
                    }}
                  >
                    {item.label}
                  </Text>
                ))}
              </Box>
            )}

            {userRole === "employee" && (
              <Box pt={2} pl={6} ml={3} borderLeft="2px" borderColor="#CCCDCE">
                {employeeSteps.map((item) => (
                  <Text
                    key={item.id}
                    py={2}
                    fontSize="sm"
                    color={pathname === item.link ? "#08705C" : "gray.600"}
                    fontWeight={pathname === item.link ? "bold" : "normal"}
                    bg={pathname === item.link ? "#08705C1F" : "transparent"}
                    borderRadius={pathname === item.link ? "md" : "none"}
                    px={2}
                    _hover={{ color: "teal.500" }}
                    cursor="pointer"
                    onClick={() => {
                      setActiveStep(item);
                      onClose();

                      if (item.link) {
                        router.push(`${item.link}`);
                      }
                    }}
                  >
                    {item.label}
                  </Text>
                ))}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

const Header = ({ user }: { user: User | null }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [breadcrumb, setBreadcrumb] = useRecoilState(breadcrumbState);
  const userRole = user?.role || "";

  useEffect(() => {
    setBreadcrumb([{ name: "Leave Management", href: "/" }]);
    handleInitialBreadcrumb();
  }, [userRole, setBreadcrumb]);

  const handleInitialBreadcrumb = () => {
    if (userRole === "admin") {
      setBreadcrumb((prev) => [...prev, { name: "Setup", href: "/setup" }]);
    } else if (userRole === "employee") {
      setBreadcrumb((prev) => [...prev, { name: "Overview", href: "/" }]);
    }
  };

  return (
    <>
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        height="5rem"
        bg="white"
        borderBottom="1px solid"
        borderColor="#E6E6E7"
        px="4"
        align="center"
        justify="space-between"
        zIndex="1000"
      >
        <HStack spacing="3" height="100%">
          {/* Mobile menu button */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            variant="ghost"
            icon={<FiMenu />}
            aria-label="Open Menu"
            onClick={onOpen}
          />

          <Link href="/">
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="#2A58AD"
              borderRightWidth={{ base: "0", md: "1px" }}
              borderRightColor="#000000"
              height="60%"
              display="flex"
              alignItems="center"
              pr="4"
            >
              RESOLVE
            </Text>
          </Link>

          <Box display={{ base: "none", md: "block" }}>
            <HStack spacing="3" height="100%">
              <Breadcrumb spacing="8px" separator="/">
                {breadcrumb.map((item, index) => (
                  <BreadcrumbItem
                    key={index}
                    isCurrentPage={index === breadcrumb.length - 1}
                  >
                    <BreadcrumbLink
                      href={item.href}
                      fontWeight={
                        index === breadcrumb.length - 1 ? "700" : "normal"
                      }
                    >
                      {item.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
            </HStack>
          </Box>
        </HStack>

        <HStack spacing="3" height="100%">
          <Box display={{ base: "none", md: "block" }}>
            <Menu>
              <MenuButton height="100%">
                <HStack
                  p={3}
                  spacing="2"
                  borderRightWidth="1px"
                  borderRightColor="#000000"
                  display="flex"
                  alignItems="center"
                  pr="2"
                >
                  <Text>Switch To</Text>
                  <Icon as={FiChevronDown} />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem>Option 1</MenuItem>
                <MenuItem>Option 2</MenuItem>
              </MenuList>
            </Menu>
          </Box>

          <IconButton
            aria-label="notifications"
            icon={<FiBell fontSize="22" />}
            variant="ghost"
            borderRightWidth={{ base: "0", md: "1px" }}
            borderRightColor="#000000"
            borderRadius="0"
            display="flex"
            alignItems="center"
            pr="2"
          />

          <Box display={{ base: "none", md: "block" }}>
            <Menu>
              <MenuButton>
                <HStack spacing="2">
                  <Text>Steven</Text>
                  <Avatar size="sm" name="Steven" />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuDivider />
                <MenuItem>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <MobileMenuContent onClose={onClose} user={user} />
        </DrawerContent>
      </Drawer>
    </>
  );
};

const SidebarWithHeader = ({ children }: { children: React.ReactNode }) => {
  const { onClose } = useDisclosure();
  const user = useRecoilValue(userAtom);

  return (
    <Box>
      <Header user={user} />

      <SidebarContent
        user={user}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />

      <Box
        h="calc(100vh - 5rem)"
        ml={{ base: 0, md: "20rem" }}
        mt="5rem"
        overflowY="auto"
      >
        {children}
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
