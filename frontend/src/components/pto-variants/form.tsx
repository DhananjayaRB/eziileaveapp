"use client";

import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignedTo, PTOVariant } from "@/lib/types";
import { PTO_VALIDATION_TOASTS } from "@/lib/utils";
import {
  Avatar,
  AvatarGroup,
  Checkbox,
  Input,
  Select,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import WarningModal from "../modal/warning";
import UsersModal from "../modal/users";

interface FormProps {
  data: PTOVariant;
  setData: (value: React.SetStateAction<PTOVariant>) => void;
  loading: boolean;
  onSubmit: () => Promise<void>;
  isEditing: boolean;
  onDiscard: () => void;
}

export function PTOVariantForm({
  data,
  setData,
  loading,
  onSubmit,
  isEditing,
  onDiscard,
}: FormProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUsersOpen,
    onOpen: onUsersOpen,
    onClose: onUsersClose,
  } = useDisclosure();

  const handleDiscard = () => {
    onOpen();
  };

  const handleUsersConfirm = (users: AssignedTo[]) => {
    setData((prev) => ({
      ...prev,
      assignedTo: users,
    }));
    onUsersClose();
  };

  const checkForEmptyFields = (data: PTOVariant) => {
    for (const [key, value] of Object.entries(data)) {
      if (value === "") {
        toast.error(
          `Incomplete Form. Please fill the ${
            PTO_VALIDATION_TOASTS[key as keyof typeof PTO_VALIDATION_TOASTS]
          } field`
        );
        return true;
      }
    }
    return false;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm space-y-4 h-auto md:h-[90%] overflow-y-scroll md:p-5 ">
      <FadeIn.Item>
        <div className="flex flex-col md:flex-row items-start justify-between bg-[#F2F3F3] p-5 rounded-lg">
          <Text
            fontWeight={700}
            fontSize={{ base: 18, md: 24 }}
            color="#383838"
            mb={{ base: 4, md: 0 }}
          >
            PTO units allowed
          </Text>
          <div className="flex flex-col md:flex-row gap-4 mt-5 w-full md:w-1/2">
            {["Half Day", "Quarter Day", "Hours"].map((unit) => (
              <div
                key={unit}
                className="w-full md:w-auto"
                style={{ flexBasis: "calc(50% - 8px)" }}
              >
                <Checkbox
                  defaultChecked={data.unitsAllowed.includes(unit)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData((prev) => ({
                        ...prev,
                        unitsAllowed: [...prev.unitsAllowed, unit],
                      }));
                    } else {
                      setData((prev) => ({
                        ...prev,
                        unitsAllowed: prev.unitsAllowed.filter(
                          (item) => item !== unit
                        ),
                      }));
                    }
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
                  <Text fontSize={{ base: 14, md: 14 }}>{unit}</Text>
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <Text
              color="#383838"
              fontWeight={700}
              fontSize={{ base: 16, md: 16 }}
            >
              PTO Variant Name
            </Text>
            <Text fontSize={{ base: 12, md: 14 }}>
              Create tailored PTO policies for specific groups of employees
              using variants
            </Text>
            <Input
              placeholder="eg. For Factory Employees"
              width={{ base: "100%", md: "40%" }}
              value={data.variantName}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  variantName: e.target.value,
                }))
              }
              _focus={{ borderColor: "#08705C" }}
              _focusVisible={{
                outline: "none",
              }}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Text
              color="#383838"
              fontWeight={700}
              fontSize={{ base: 16, md: 16 }}
            >
              Description
            </Text>
            <Textarea
              placeholder="eg. Need time off for personal errands? Use PTO."
              value={data.description}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="flex-col bg-[#F2F3F3] p-5 rounded-lg space-y-5">
          <Text
            fontWeight={700}
            fontSize={{ base: 16, md: 24 }}
            color="#383838"
          >
            Eligibility Criteria
          </Text>

          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Applicable after
            </Text>

            <div className="flex items-center">
              <div className="flex items-center bg-white px-3 rounded-xl">
                <Input
                  type="number"
                  value={data.applicableAfter.days}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      applicableAfter: {
                        ...prev.applicableAfter,
                        days: e.target.value,
                      },
                    }))
                  }
                  w="75px"
                  border="none"
                  _focus={{ borderColor: "transparent" }}
                  _focusVisible={{
                    outline: "none",
                  }}
                />
                <Text fontSize={{ base: 14, md: 16 }} color="#9A9B9D">
                  (days)
                </Text>
              </div>
              <Text
                fontSize={{ base: 14, md: 16 }}
                color="#383838"
                mx={{ base: "3", md: "10" }}
              >
                from
              </Text>
              <Select
                w="50%"
                bg="white"
                h="44px"
                fontSize={{ base: 10, md: 16 }}
                borderRadius="12px"
                value={data.applicableAfter.duration}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    applicableAfter: {
                      ...prev.applicableAfter,
                      duration: e.target.value,
                    },
                  }))
                }
              >
                <option value="doj">Date of Joining</option>
                <option value="doa">Date of Anniversary</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Does this require a review workflow for approval?
            </Text>

            <div className="w-full md:w-[60%]">
              <Tabs
                value={data.requiresReviewWorkflow ? "workflow" : "noWorkflow"}
                onValueChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    requiresReviewWorkflow: value === "workflow",
                  }))
                }
                className="bg-white rounded-xl py-1.5 w-fit"
              >
                <TabsList className="space-x-1 bg-white">
                  <TabsTrigger value="workflow">Workflow</TabsTrigger>
                  <TabsTrigger value="noWorkflow">No Workflow</TabsTrigger>
                </TabsList>
              </Tabs>
              {!data.requiresReviewWorkflow && (
                <Text fontSize={{ base: 14, md: 14 }} color="#000" mt={4}>
                  If leave you select "No workflow" then PTO will be
                  auto-approved and leave balance will be deducted immediately.
                </Text>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Approval request should be made
            </Text>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0">
              <div className="flex items-center bg-white px-3 rounded-xl">
                <Input
                  type="number"
                  value={data.approvalRequestsMadeBefore}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      approvalRequestsMadeBefore: e.target.value,
                    }))
                  }
                  w={{ base: "100%", md: "75px" }}
                  border="none"
                  _focus={{ borderColor: "transparent" }}
                  _focusVisible={{
                    outline: "none",
                  }}
                />
                <Text fontSize={{ base: 14, md: 16 }} color="#9A9B9D">
                  (days)
                </Text>
              </div>
              <Text
                fontSize={{ base: 14, md: 16 }}
                color="#383838"
                ml={{ base: 0, md: "10" }}
              >
                in advance
              </Text>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Minimum hours required
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.minimumHoursRequired}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    minimumHoursRequired: e.target.value,
                  }))
                }
                w={{ base: "100%", md: "75px" }}
                border="none"
                _focus={{ borderColor: "transparent" }}
                _focusVisible={{
                  outline: "none",
                }}
              />
              <Text fontSize={{ base: 14, md: 16 }} color="#9A9B9D">
                (hours)
              </Text>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Max hours allowed
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.maxHoursAllowed}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    maxHoursAllowed: e.target.value,
                  }))
                }
                w={{ base: "100%", md: "75px" }}
                border="none"
                _focus={{ borderColor: "transparent" }}
                _focusVisible={{
                  outline: "none",
                }}
              />
              <Text fontSize={{ base: 14, md: 16 }} color="#9A9B9D">
                (hours)
              </Text>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Max instances
            </Text>

            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0">
                <div className="flex items-center bg-white px-3 rounded-xl">
                  <Input
                    type="number"
                    value={data.maxInstances.days}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        maxInstances: {
                          ...prev.maxInstances,
                          days: e.target.value,
                        },
                      }))
                    }
                    w={{ base: "100%", md: "75px" }}
                    border="none"
                    _focus={{ borderColor: "transparent" }}
                    _focusVisible={{
                      outline: "none",
                    }}
                  />
                  <Text fontSize={{ base: 14, md: 16 }} color="#9A9B9D">
                    (days)
                  </Text>
                </div>
                <Text
                  fontSize={{ base: 14, md: 16 }}
                  color="#383838"
                  mx={{ md: 4 }}
                >
                  in a
                </Text>
                <Select
                  w={{ base: "100%", md: "40%" }}
                  bg="white"
                  h="44px"
                  borderRadius="12px"
                  value={data.maxInstances.duration}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      maxInstances: {
                        ...prev.maxInstances,
                        duration: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </Select>
              </div>
              <Text
                fontSize={{ base: 14, md: 16 }}
                color="#9A9B9D"
                ml={{ md: 4 }}
              >
                If the value is 0, It is understood that there is no limit.
              </Text>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              During notice period, PTO is
            </Text>

            <Tabs
              value={data.ptoDuringNoticePeriod ? "allowed" : "notAllowed"}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  ptoDuringNoticePeriod: value === "allowed",
                }))
              }
              className="bg-white rounded-xl py-1.5"
            >
              <TabsList className="space-x-1 bg-white">
                <TabsTrigger value="allowed">Allowed</TabsTrigger>
                <TabsTrigger value="notAllowed">Not Allowed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Supporting documents are
            </Text>

            <div className="flex-col w-full md:w-[60%]">
              <Tabs
                value={data.supportingDocuments.status}
                onValueChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    supportingDocuments: {
                      ...prev.supportingDocuments,
                      status: value,
                    },
                  }))
                }
                className="bg-white rounded-xl py-1.5 w-fit"
              >
                <TabsList className="space-x-1 bg-white">
                  <TabsTrigger value="required">Required</TabsTrigger>
                  <TabsTrigger value="notRequired">Not Required</TabsTrigger>
                </TabsList>
              </Tabs>
              <Textarea
                mt={4}
                bg="white"
                w={{ base: "100%", md: "100%" }}
                value={data.supportingDocuments.description}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    supportingDocuments: {
                      ...prev.supportingDocuments,
                      description: e.target.value,
                    },
                  }))
                }
                placeholder="Enter the details of the documents to be added. This message will be displayed to your employees while uploading documents."
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              If Max. PTO instances/ hours are crossed
            </Text>

            <Tabs
              value={data.ptoCrossed.option}
              onValueChange={(value) => {
                setData((prev) => ({
                  ...prev,
                  ptoCrossed: {
                    ...prev.ptoCrossed,
                    option: value,
                    subOptions:
                      value === "deductFromBalance"
                        ? prev.ptoCrossed.subOptions
                        : [],
                  },
                }));
              }}
              className="bg-white rounded-xl py-1.5"
            >
              <TabsList className="space-x-1 bg-white">
                <TabsTrigger value="lop">Loss of Pay</TabsTrigger>
                <TabsTrigger value="deductFromBalance">
                  Deduct from Leave Balance
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {data.ptoCrossed.option === "deductFromBalance" && (
            <div className="flex flex-col md:ml-[40%] mt-4">
              <Text
                fontSize={{ base: 14, md: 16 }}
                color="#383838"
                w={{ base: "100%", md: "40%" }}
              >
                Deduct Pay for
              </Text>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-5 mt-3">
                {["Half Day", "Quarter Day", "Hours"].map((unit) => (
                  <div key={unit} className="flex items-center">
                    <Checkbox
                      isChecked={data.ptoCrossed.subOptions.includes(unit)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setData((prev) => ({
                            ...prev,
                            ptoCrossed: {
                              ...prev.ptoCrossed,
                              subOptions: [...prev.ptoCrossed.subOptions, unit],
                            },
                          }));
                        } else {
                          setData((prev) => ({
                            ...prev,
                            ptoCrossed: {
                              ...prev.ptoCrossed,
                              subOptions: prev.ptoCrossed.subOptions.filter(
                                (item) => item !== unit
                              ),
                            },
                          }));
                        }
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
                      <Text fontSize={{ base: 14, md: 14 }}>{unit}</Text>
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-start">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              PTO will be granted
            </Text>

            <Select
              w="50%"
              bg="white"
              h="44px"
              borderRadius="12px"
              value={data.ptoGranted}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  ptoGranted: e.target.value,
                }))
              }
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Select>
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="flex-col bg-[#F2F3F3] p-5 rounded-lg space-y-5">
          <Text
            fontWeight={700}
            fontSize={{ base: 14, md: 24 }}
            color="#383838"
          >
            Assign to Employees
          </Text>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 mb-5">
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
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="flex flex-col-reverse md:flex-row items-center justify-end md:space-y-0 md:space-x-5 p-5">
          <Button
            variant="outline"
            icon={FaTrash}
            iconPosition="right"
            w={{ base: "100%", md: "auto" }}
            py={{ base: 4 }}
            onClick={handleDiscard}
          >
            Discard
          </Button>
          <Button
            onClick={() => {
              if (checkForEmptyFields(data)) {
                return;
              }

              onSubmit();
            }}
            isLoading={loading}
            w={{ base: "100%", md: "auto" }}
            py={{ base: 4 }}
            mb={{ base: 4, md: 0 }}
          >
            {isEditing ? "Update Variant" : "Create Variant"}
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
      <UsersModal
        isOpen={isUsersOpen}
        onClose={onUsersClose}
        onConfirm={handleUsersConfirm}
        assignedTo={data.assignedTo}
      />
    </div>
  );
}
