"use client";

import * as FadeIn from "@/components/animation";
import { Button } from "@/components/core/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignedTo, CompOffVariant } from "@/lib/types";
import { COMPOFF_VALIDATION_TOASTS } from "@/lib/utils";
import {
  Avatar,
  AvatarGroup,
  Checkbox,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import WarningModal from "../modal/warning";
import UsersModal from "../modal/users";

interface FormProps {
  data: CompOffVariant;
  setData: (value: React.SetStateAction<CompOffVariant>) => void;
  loading: boolean;
  onSubmit: () => Promise<void>;
  isEditing: boolean;
  onDiscard: () => void;
}

export function CompOffVariantForm({
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

  const checkForEmptyFields = (data: CompOffVariant) => {
    for (const [key, value] of Object.entries(data)) {
      if (value === "") {
        toast.error(
          `Incomplete Form. Please fill the ${
            COMPOFF_VALIDATION_TOASTS[
              key as keyof typeof COMPOFF_VALIDATION_TOASTS
            ]
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
        <div className="flex flex-col items-start justify-between bg-[#F2F3F3] p-5 rounded-lg">
          <Text
            fontWeight={700}
            fontSize={{ base: 18, md: 24 }}
            color="#383838"
            mb={{ base: 4, md: 0 }}
          >
            Comp-off units allowed
          </Text>
          <div className="flex flex-col flex-wrap gap-4 mt-5 w-full md:w-1/2">
            {["Full Day", "Half Day", "Quarter Day", "Hours"].map((unit) => (
              <div
                key={unit}
                className="w-full md:w-auto flex items-center justify-between"
                style={{ flexBasis: "calc(50% - 8px)" }}
              >
                <Checkbox
                  defaultChecked={data.unitsAllowed.some(
                    (item) => item.unit === unit
                  )}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData((prev) => ({
                        ...prev,
                        unitsAllowed: [
                          ...prev.unitsAllowed,
                          { unit, duration: "" },
                        ],
                      }));
                    } else {
                      setData((prev) => ({
                        ...prev,
                        unitsAllowed: prev.unitsAllowed.filter(
                          (item) => item.unit !== unit
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
                  <Text fontSize={{ base: 14, md: 16 }} fontWeight={600}>
                    {unit}
                  </Text>
                </Checkbox>

                <div className="flex items-center bg-white px-3 rounded-xl">
                  <Input
                    type="number"
                    value={
                      data.unitsAllowed.find((item) => item.unit === unit)
                        ?.duration || ""
                    }
                    disabled={
                      !data.unitsAllowed.some((item) => item.unit === unit)
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setData((prev) => ({
                        ...prev,
                        unitsAllowed: prev.unitsAllowed.map((item) =>
                          item.unit === unit
                            ? { ...item, duration: value }
                            : item
                        ),
                      }));
                    }}
                    w="75px"
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
            ))}
          </div>

          <div className="flex flex-row items-start md:items-center mt-5 w-full md:w-1/2 justify-between">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              //   w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Minimum hours required
            </Text>
            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.minimumHoursRequired || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setData((prev) => ({
                    ...prev,
                    minimumHoursRequired: value,
                  }));
                }}
                w="75px"
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
              Comp-off Variant Name
            </Text>
            <Text fontSize={{ base: 12, md: 14 }}>
              Create tailored comp-off policies for specific groups of employees
              using variants
            </Text>
            <Input
              placeholder="eg. For Factory Employees in Karnataka"
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
              placeholder="eg. Earn comp-offs for working extra hours and use them for time off"
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

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Maximum Comp-Off applications
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.maxCompOffApplications.count}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    maxCompOffApplications: {
                      ...prev.maxCompOffApplications,
                      count: e.target.value,
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
              w={{ base: "100%", md: "15%" }}
              bg="white"
              h="44px"
              borderRadius="12px"
              value={data.maxCompOffApplications.duration}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  maxCompOffApplications: {
                    ...prev.maxCompOffApplications,
                    duration: e.target.value,
                  },
                }))
              }
            >
              <option value="month">Month</option>
              <option value="year">Year</option>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
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
                  If you select "No workflow" then comp-off will be
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
            >
              Approval request should be made
            </Text>

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

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Comp-off should be availed within
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.availedWithin}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    availedWithin: e.target.value,
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
              from date of working
            </Text>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Allow on non-working days?
            </Text>

            <Tabs
              value={data.allowNonWorkingDays ? "allowed" : "notAllowed"}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  allowNonWorkingDays: value === "allowed",
                }))
              }
              className="bg-white rounded-xl py-1.5 w-fit"
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
            >
              Withdrawal of application allowed
            </Text>

            <Tabs
              value={data.withdrawalOfApplicationAllowed}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  withdrawalOfApplicationAllowed: value,
                }))
              }
              className="bg-white rounded-xl py-1.5 w-fit"
            >
              <TabsList className="space-x-1 bg-white">
                <TabsTrigger value="beforeApproval">
                  Before Approval
                </TabsTrigger>
                <TabsTrigger value="afterApproval">After Approval</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              During notice period, Comp-offs are
            </Text>

            <Tabs
              value={data.compOffsDuringNoticePeriod ? "allowed" : "notAllowed"}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  compOffsDuringNoticePeriod: value === "allowed",
                }))
              }
              className="bg-white rounded-xl py-1.5 w-fit"
            >
              <TabsList className="space-x-1 bg-white">
                <TabsTrigger value="allowed">Allowed</TabsTrigger>
                <TabsTrigger value="notAllowed">Not Allowed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="flex-col bg-[#F2F3F3] p-5 rounded-lg space-y-5">
          <div className="flex items-center justify-between">
            <Text
              fontWeight={700}
              fontSize={{ base: 16, md: 24 }}
              color="#383838"
            >
              Carry Forward and lapse
            </Text>

            <Switch
              colorScheme="green"
              isChecked={data.carryForwardEnabled}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  carryForwardEnabled: e.target.checked,
                }))
              }
              sx={{
                "& .chakra-switch__track[data-checked]": {
                  backgroundColor: "#08705C",
                },
              }}
            />
          </div>

          {data.carryForwardEnabled && (
            <FadeIn.Item>
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0">
                  <Text
                    fontSize={{ base: 14, md: 16 }}
                    color="#383838"
                    w={{ base: "100%", md: "40%" }}
                    mb={{ base: 4, md: 0 }}
                  >
                    Earned Comp-Off days will lapse in
                  </Text>

                  <div className="flex items-center bg-white px-3 rounded-xl mr-4">
                    <Input
                      type="number"
                      value={data.carryForwardLapseIn.limit}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          carryForwardLapseIn: {
                            ...prev.carryForwardLapseIn,
                            limit: e.target.value,
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
                  </div>

                  <Select
                    w={{ base: "100%", md: "15%" }}
                    bg="white"
                    h="44px"
                    borderRadius="12px"
                    value={data.carryForwardLapseIn.duration}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        carryForwardLapseIn: {
                          ...prev.carryForwardLapseIn,
                          duration: e.target.value,
                        },
                      }))
                    }
                  >
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </Select>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0">
                  <Text
                    fontSize={{ base: 14, md: 16 }}
                    color="#383838"
                    w={{ base: "100%", md: "40%" }}
                  >
                    Carry forward to next cycle
                  </Text>

                  <div className="flex items-center bg-white px-3 rounded-xl">
                    <Input
                      type="number"
                      value={data.carryForwardToNextCycle}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          carryForwardToNextCycle: e.target.value,
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
                </div>
              </div>
            </FadeIn.Item>
          )}
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="flex-col bg-[#F2F3F3] p-5 rounded-lg space-y-5">
          <div className="flex items-center justify-between">
            <Text
              fontWeight={700}
              fontSize={{ base: 16, md: 24 }}
              color="#383838"
            >
              Compensation
            </Text>

            <Switch
              colorScheme="green"
              isChecked={data.compensationEnabled}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  compensationEnabled: e.target.checked,
                }))
              }
              sx={{
                "& .chakra-switch__track[data-checked]": {
                  backgroundColor: "#08705C",
                },
              }}
            />
          </div>

          {data.compensationEnabled && (
            <FadeIn.Item>
              <div className="space-y-5">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0">
                  <Text
                    fontSize={{ base: 14, md: 16 }}
                    color="#383838"
                    w={{ base: "100%", md: "40%" }}
                    mb={{ base: 4, md: 0 }}
                  >
                    Maximum days that can be encashed
                  </Text>

                  <div className="flex items-center bg-white px-3 rounded-xl mr-4">
                    <Input
                      type="number"
                      value={data.maxDaysThatCanBeEncashed.days}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          maxDaysThatCanBeEncashed: {
                            ...prev.maxDaysThatCanBeEncashed,
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

                  <div className="flex items-center bg-white px-3 rounded-xl mr-4">
                    <Input
                      type="number"
                      value={data.maxDaysThatCanBeEncashed.hours}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          maxDaysThatCanBeEncashed: {
                            ...prev.maxDaysThatCanBeEncashed,
                            hours: e.target.value,
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
                      (hours)
                    </Text>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0">
                  <Text
                    fontSize={{ base: 14, md: 16 }}
                    color="#383838"
                    w={{ base: "100%", md: "40%" }}
                  >
                    Compensation options
                  </Text>

                  <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                      {["En-cashment", "Convert to leaves"].map((unit) => (
                        <Checkbox
                          key={unit}
                          defaultChecked={data.compensationOptions.some(
                            (option) => option.option === unit
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setData((prev) => ({
                                ...prev,
                                compensationOptions: [
                                  ...prev.compensationOptions,
                                  { option: unit, subOptions: [] },
                                ],
                              }));
                            } else {
                              setData((prev) => ({
                                ...prev,
                                compensationOptions:
                                  prev.compensationOptions.filter(
                                    (item) => item.option !== unit
                                  ),
                              }));
                            }
                          }}
                          mr={4}
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
                          <Text
                            fontSize={{ base: 14, md: 14 }}
                            color="#000"
                            fontWeight={600}
                          >
                            {unit}
                          </Text>
                        </Checkbox>
                      ))}
                    </div>

                    {data.compensationOptions.some(
                      (option) => option.option === "Convert to leaves"
                    ) && (
                      <div>
                        {[
                          "Sick Leave",
                          "Casual Leave",
                          "Emergency Leave",
                          "Bereavement Leave",
                          "Maternity Leave",
                          "Paternity Leave",
                        ].map((subOption) => (
                          <Checkbox
                            key={subOption}
                            defaultChecked={data.compensationOptions
                              .find(
                                (option) =>
                                  option.option === "Convert to leaves"
                              )
                              ?.subOptions.includes(subOption)}
                            onChange={(e) => {
                              setData((prev) => {
                                const updatedOptions =
                                  prev.compensationOptions.map((option) => {
                                    if (option.option === "Convert to leaves") {
                                      const subOptions = e.target.checked
                                        ? [...option.subOptions, subOption]
                                        : option.subOptions.filter(
                                            (item) => item !== subOption
                                          );
                                      return { ...option, subOptions };
                                    }
                                    return option;
                                  });
                                return {
                                  ...prev,
                                  compensationOptions: updatedOptions,
                                };
                              });
                            }}
                            mr={4}
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
                            <Text
                              fontSize={{ base: 14, md: 14 }}
                              color="#000"
                              fontWeight={600}
                            >
                              {subOption}
                            </Text>
                          </Checkbox>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn.Item>
          )}
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="flex-col  bg-[#F2F3F3] p-5 rounded-lg space-y-5">
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
