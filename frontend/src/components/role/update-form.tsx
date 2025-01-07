import * as FadeIn from "@/components/animation";
import { Badge } from "@/components/core/badge";
import { Button } from "@/components/core/button";
import { Combobox } from "@/components/ui/combobox";
import { Options, useResolveAPI } from "@/hooks/resolve";
import { ApplyTo, Role } from "@/lib/types";
import {
  Avatar,
  AvatarGroup,
  Box,
  Checkbox,
  Flex,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import DeleteModal from "../modal/delete";
import WarningModal from "../modal/warning";
import UsersModal from "../modal/users";

const transformOptions = (options: Options) => {
  const transformedOptions: {
    [key: string]: { value: string; label: string }[];
  } = {};

  Object.keys(options).forEach((key) => {
    transformedOptions[key] = options[key].map((option) => ({
      value: option.attribute_name,
      label: option.attribute_name,
    }));
  });

  return transformedOptions;
};

interface Props {
  setData: (value: React.SetStateAction<Role>) => void;
  data: Role;
  applyTo: ApplyTo;
  handleSelect: (selected: string, category: keyof ApplyTo) => void;
  removeBadge: (key: string, category: string) => void;
  onSubmit: () => void;
  onDiscard: () => void;
  isLoading: boolean;
  onDelete: () => void;
}

export function UpdateRoleForm({
  setData,
  data,
  applyTo,
  handleSelect,
  removeBadge,
  onSubmit,
  onDiscard,
  isLoading,
  onDelete,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isUsersOpen,
    onOpen: onUsersOpen,
    onClose: onUsersClose,
  } = useDisclosure();

  const [transformedOptions, setTransformedOptions] = useState<{
    [key: string]: { value: string; label: string }[];
  }>({});

  const { organisationStructure, options } = useResolveAPI();

  useEffect(() => {
    if (options) {
      setTransformedOptions(transformOptions(options));
    }
  }, [options]);

  const handleDiscard = () => {
    onOpen();
  };

  const handleDelete = () => {
    onDeleteOpen();
  };

  const handleUsersConfirm = (
    users: {
      employee_number: string;
      name: string;
    }[]
  ) => {
    setData((prev) => ({
      ...prev,
      assignedTo: users,
    }));
    onUsersClose();
  };

  return (
    <>
      <FadeIn.Item>
        <div className="p-4 md:px-6 md:py-8 flex flex-col space-y-3">
          <Text
            color="#383838"
            fontWeight={700}
            fontSize={{ base: 16, md: 16 }}
          >
            Role Name
          </Text>
          <div className="flex flex-col md:flex-row md:items-center space-x-0 space-y-2 md:space-y-0 md:space-x-2">
            <Input
              placeholder="eg. Admin Finance"
              bg="white"
              width={{ base: "100%", md: "15%" }}
              _focus={{ borderColor: "#08705C" }}
              _focusVisible={{
                outline: "none",
              }}
              value={data.roleName}
              onChange={(e) =>
                setData((prev) => ({ ...prev, roleName: e.target.value }))
              }
            />
            <Button
              variant="outline"
              borderColor="#FF9500"
              applyColor="#FF9500"
              icon={FaTrash}
              iconPosition="right"
              onClick={handleDelete}
            >
              Delete Role
            </Button>
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="p-4 md:px-6 md:py-8 flex flex-col md:flex-col items-start justify-between bg-white md:p-5 mt-6 rounded-lg md:space-y-6">
          <Text
            fontWeight={700}
            fontSize={{ base: 18, md: 24 }}
            color="#383838"
            mb={{ base: 4, md: 5 }}
          >
            Role Permissions
          </Text>
          {Object.keys(data.permissions).map((key) => (
            <Flex
              key={key}
              flexDir="row"
              alignItems="center"
              mb={2}
              w="100%"
              gap={5}
              py={{ base: 4, md: 0 }}
              borderBottom={{ base: "1px solid #CCCDCE", md: "none" }}
            >
              <Text
                fontSize={{ base: 14, md: 16 }}
                w={{ base: "50%", md: "30%" }}
              >
                {key}
              </Text>
              <Flex direction="row" gap={7} alignItems="center">
                <Checkbox
                  isChecked={
                    data.permissions[key as keyof typeof data.permissions].view
                  }
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      permissions: {
                        ...prev.permissions,
                        [key]: {
                          ...prev.permissions[
                            key as keyof typeof data.permissions
                          ],
                          view: e.target.checked,
                        },
                      },
                    }));
                  }}
                  sx={{
                    "& .chakra-checkbox__control": {
                      borderColor: "#08705C",
                      _checked: {
                        bg: "#08705C",
                        borderColor: "#08705C",
                        color: "white",
                      },
                    },
                  }}
                >
                  <Text fontSize={{ base: 12, md: 14 }} fontWeight={600}>
                    View
                  </Text>
                </Checkbox>
                <Checkbox
                  isChecked={
                    data.permissions[key as keyof typeof data.permissions]
                      .modify
                  }
                  onChange={(e) => {
                    setData((prev) => ({
                      ...prev,
                      permissions: {
                        ...prev.permissions,
                        [key]: {
                          ...prev.permissions[
                            key as keyof typeof data.permissions
                          ],
                          modify: e.target.checked,
                          view: e.target.checked
                            ? true
                            : prev.permissions[
                                key as keyof typeof data.permissions
                              ].view,
                        },
                      },
                    }));
                  }}
                  sx={{
                    "& .chakra-checkbox__control": {
                      borderColor: "#08705C",
                      _checked: {
                        bg: "#08705C",
                        borderColor: "#08705C",
                        color: "white",
                      },
                    },
                  }}
                >
                  <Text fontSize={{ base: 12, md: 14 }} fontWeight={600}>
                    Modify
                  </Text>
                </Checkbox>
              </Flex>
            </Flex>
          ))}

          <Flex direction={{ base: "column", md: "row" }} w="100%" gap={5}>
            <Text
              fontSize={{ base: 14, md: 16 }}
              w={{ base: "50%", md: "30%" }}
            >
              Allow On Behalf Of Others
            </Text>
            <Flex
              direction="row"
              w={{ base: "100%", md: "20%" }}
              justify={{ base: "flex-start", md: "flex-end" }}
              alignItems="center"
            >
              {Object.keys(data.allowOnBehalfOfOthers).map((key) => (
                <Flex
                  key={key}
                  flexDir={"row"}
                  alignItems="center"
                  w="100%"
                  gap={5}
                >
                  <Checkbox
                    isChecked={
                      data.allowOnBehalfOfOthers[
                        key as keyof typeof data.allowOnBehalfOfOthers
                      ]
                    }
                    onChange={(e) => {
                      setData((prev) => ({
                        ...prev,
                        allowOnBehalfOfOthers: {
                          ...prev.allowOnBehalfOfOthers,
                          [key]: e.target.checked,
                        },
                      }));
                    }}
                    sx={{
                      "& .chakra-checkbox__control": {
                        borderColor: "#08705C",
                        _checked: {
                          bg: "#08705C",
                          borderColor: "#08705C",
                          color: "white",
                        },
                      },
                    }}
                  >
                    <Text fontSize={{ base: 12, md: 14 }} fontWeight={600}>
                      {key}
                    </Text>
                  </Checkbox>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="p-4 md:px-6 md:py-8 flex flex-col md:flex-col items-start justify-between bg-white md:p-5 mt-6 rounded-lg md:space-y-2">
          <Text
            fontWeight={700}
            fontSize={{ base: 18, md: 24 }}
            color="#383838"
            mb={{ base: 4, md: 5 }}
          >
            Apply role to
          </Text>

          {organisationStructure?.configs.sub_types.map((subType) => (
            <Flex
              flexDir={{ base: "column", md: "row" }}
              p={4}
              rounded="lg"
              w="100%"
              gap={5}
              alignItems="center"
              key={subType.sub_type_id}
            >
              <Box w={{ base: "100%", md: "15%" }}>
                <Combobox
                  options={transformedOptions[subType.sub_type] || []}
                  placeholder={subType.sub_type}
                  selectedOptions={
                    applyTo[subType.sub_type as keyof ApplyTo] || []
                  }
                  onSelect={(selected) =>
                    handleSelect(selected, subType.sub_type as keyof ApplyTo)
                  }
                />
              </Box>
              <Flex flexDir="row" flexWrap="wrap" gap={2}>
                {Object.keys(applyTo).length > 0 &&
                  applyTo[subType.sub_type].map((item) => (
                    <Badge
                      key={item}
                      text={item}
                      onRemove={() => removeBadge(item, subType.sub_type)}
                    />
                  ))}
              </Flex>
            </Flex>
          ))}

          <div className="flex-col p-5 rounded-lg space-y-5 w-full">
            <Text
              fontWeight={700}
              fontSize={{ base: 18, md: 24 }}
              color="#383838"
              mb={{ base: 4, md: 5 }}
            >
              Assign to Employees
            </Text>

            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 mb-5">
              {data.assignedTo.length === 0 ? (
                <Text
                  fontSize={{ base: 14, md: 16 }}
                  color="#383838"
                  w={{ base: "100%", md: "40%" }}
                >
                  Not assigned to any employees yet
                </Text>
              ) : (
                <>
                  <AvatarGroup size="sm" max={5}>
                    {data.assignedTo.map((employee) => (
                      <Avatar
                        key={employee.employee_number}
                        name={employee.name}
                      />
                    ))}
                  </AvatarGroup>
                  <Text
                    ml={{ base: 0, md: 2 }}
                    fontSize={{ base: 14, md: 16 }}
                    color="#383838"
                    w={{ base: "100%", md: "40%" }}
                  >
                    Assigned to {data.assignedTo.length} employees
                  </Text>
                </>
              )}

              {data.assignedTo.length === 0 ? (
                <Button variant="outline" onClick={onUsersOpen}>
                  Assign Employees
                </Button>
              ) : (
                <div className="w-full justify-end flex">
                  <Button variant="outline" onClick={onUsersOpen}>
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="p-4 md:px-6 md:py-8 flex flex-col-reverse md:flex-row items-center md:justify-end md:p-5 mt-6 rounded-lg space-y-3 md:space-y-0 space-x-0 md:space-x-3">
          <Button
            w={{ base: "100%", md: "auto" }}
            variant="outline"
            py={3}
            mt={{ base: 4, md: 0 }}
            onClick={handleDiscard}
          >
            Discard Changes
          </Button>
          <Button
            w={{ base: "100%", md: "10%" }}
            py={3}
            onClick={onSubmit}
            icon={IoCheckmark}
            iconPosition="right"
            isLoading={isLoading}
          >
            Update Role
          </Button>
        </div>
      </FadeIn.Item>

      <WarningModal
        isOpen={isOpen}
        onClose={onClose}
        heading="Discard Changes"
        description="Are you sure you want to discard all changes?"
        onConfirm={onDiscard}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        heading="Delete Role"
        description="Are you sure you want to delete this role?"
        onConfirm={onDelete}
        isLoading={isLoading}
      />

      <UsersModal
        isOpen={isUsersOpen}
        onClose={onUsersClose}
        onConfirm={handleUsersConfirm}
        assignedTo={data.assignedTo}
      />
    </>
  );
}
