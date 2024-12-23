"use client";

import * as FadeIn from "@/components/animation";
import * as FadeOut from "@/components/animation/fadeout";
import { Button } from "@/components/core/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignedTo, LeaveVariant } from "@/lib/types";
import { VALIDATION_TOASTS } from "@/lib/utils";
import {
  Avatar,
  AvatarGroup,
  Card,
  Checkbox,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { toast } from "sonner";
import WarningModal from "../modal/warning";
import UsersModal from "../modal/users";

const proRataOptions = [
  {
    title: "Full Month",
    description:
      "Consider the entire month as worked for earned leaves, regardless of actual days worked. ",
  },
  {
    title: "Monthly Slabs",
    description:
      "Calculate earned leaves by dividing the month into equal periods and determining the number of days worked within each period. ",
  },
  {
    title: "Actual Days Worked",
    description:
      "Round fractions of days worked to the nearest half or full day before calculating earned leaves. This can be rounded up or down based on your organisation's policy. ",
  },
];

interface FormProps {
  data: LeaveVariant;
  setData: (value: React.SetStateAction<LeaveVariant>) => void;
  loading: boolean;
  onSubmit: () => Promise<void>;
  editMode: boolean;
  onDiscard: () => void;
}

export function LeaveVariantForm({
  data,
  setData,
  loading,
  onSubmit,
  editMode,
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

  const checkForEmptyFields = (data: LeaveVariant) => {
    for (const [key, value] of Object.entries(data)) {
      if (value === "") {
        toast.error(
          `Incomplete Form. Please fill the ${
            VALIDATION_TOASTS[key as keyof typeof VALIDATION_TOASTS]
          } field`
        );
        return true;
      }
    }
    if (Number(data.negativeLeaveBalanceAllowedUpTo) > 0) {
      toast.error("Negative leave balance must not be positive.");
      return true;
    }
    return false;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm space-y-4 h-auto md:h-[90%] md:p-5 overflow-y-scroll">
      <FadeIn.Item>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-[#F2F3F3] p-5 rounded-lg">
          <Text
            fontWeight={700}
            fontSize={{ base: 18, md: 24 }}
            color="#383838"
            mb={{ base: 4, md: 0 }}
          >
            Minimum leave unit
          </Text>
          <div className="flex flex-wrap gap-4">
            {["Full Day", "Half Day", "Quarter Day", "Hours"].map((unit) => (
              <div
                key={unit}
                className="w-full md:w-auto"
                style={{ flexBasis: "calc(50% - 8px)" }}
              >
                <Checkbox
                  defaultChecked={data.minimumLeaveUnit.includes(unit)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData((prev) => ({
                        ...prev,
                        minimumLeaveUnit: [...prev.minimumLeaveUnit, unit],
                      }));
                    } else {
                      setData((prev) => ({
                        ...prev,
                        minimumLeaveUnit: prev.minimumLeaveUnit.filter(
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
              Leave Variant Name
            </Text>
            <Text fontSize={{ base: 12, md: 14 }}>
              Create tailored leave policies for specific groups of employees
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
              placeholder="eg. It's essential to rest and recover when you are sick. Use your sick leaves accordingly."
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
            Leave granting
          </Text>

          <div className="flex flex-col md:flex-row items-start md:items-center">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Leaves will be granted based on
            </Text>

            <Tabs
              value={data.leavesGrantedBasedOn}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  leavesGrantedBasedOn: value,
                }))
              }
              className="bg-white rounded-xl py-1.5 w-[250px]"
            >
              <TabsList className="space-x-1 bg-white">
                <TabsTrigger value="calendarDays">Calendar Days</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Paid days in a year
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.paidDaysInAYear}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    paidDaysInAYear: e.target.value,
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
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Grant Leaves
            </Text>

            <Tabs
              value={data.grantLeaves}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  grantLeaves: value,
                }))
              }
              className="bg-white rounded-xl py-1.5"
            >
              <TabsList className="space-x-1 bg-white">
                <TabsTrigger value="inAdvance">In Advance</TabsTrigger>
                <TabsTrigger value="afterEarning">After Earning</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select
              w={{ base: "100%", md: "15%" }}
              ml={{ base: 0, md: 3 }}
              mt={{ base: 4, md: 0 }}
              bg="white"
              h="44px"
              value={data.grantPer}
              onChange={(e) =>
                setData((prev) => ({ ...prev, grantPer: e.target.value }))
              }
              borderRadius="12px"
            >
              <option value="perMonth">Per Month</option>
              <option value="perYear">Per Year</option>
            </Select>
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
            Pro-Rata Calculations
          </Text>
          <Text fontSize={{ base: 14, md: 14 }} color="#383838">
            Adjust how you would like the employees to earn the leaves. This
            ensures fair allocation of benefits, especially for new hires or
            employees leaving mid-year.
          </Text>

          <div className="flex-col relative">
            <div className="flex flex-col md:flex-row items-center justify-between relative">
              {proRataOptions.map((option, index) => (
                <div
                  key={index}
                  className="relative w-full mb-3 md:mb-0 md:space-y-0 md:w-[31.5%]"
                >
                  <Card
                    p={5}
                    height="190px"
                    borderRadius="12px"
                    borderColor={
                      data.proRataCalculation === option.title
                        ? "#08705C"
                        : "transparent"
                    }
                    borderWidth="2px"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        proRataCalculation: option.title,
                      }))
                    }
                    cursor="pointer"
                  >
                    <div className="flex items-center justify-between">
                      <Text
                        fontWeight={700}
                        fontSize={{ base: 14, md: 14 }}
                        color="#383838"
                      >
                        {option.title}
                      </Text>

                      <input
                        type="radio"
                        checked={data.proRataCalculation === option.title}
                        className="appearance-none w-4 h-4 rounded-full border-2 border-[#08705C] checked:bg-[#08705C] checked:border-[#08705C] focus:outline-none focus:ring-2 focus:ring-[#08705C] focus:ring-opacity-50 transition-all duration-200 ease-in-out cursor-pointer"
                      />
                    </div>

                    <Text
                      fontSize={{ base: 14, md: 14 }}
                      color="#383838"
                      mt={4}
                    >
                      {option.description}
                    </Text>
                  </Card>

                  {/* {option.title === "Monthly Slabs" && (
                    <div
                      className="hidden md:block absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-0 h-0 transition-all duration-300"
                      style={{
                        borderLeft: "12px solid transparent",
                        borderRight: "12px solid transparent",
                        borderBottom: "12px solid white",
                      }}
                    />
                  )} */}
                </div>
              ))}
            </div>

            {data.proRataCalculation === "Monthly Slabs" && (
              <div className="w-full mt-4 bg-white rounded-lg p-6">
                <div className="flex flex-col">
                  <div className="flex items-center mb-5">
                    <Text
                      fontSize={{ base: 16, md: 16 }}
                      color="#383838"
                      fontWeight={700}
                    >
                      Set Slabs
                    </Text>
                    <p className="ml-1 text-[#383838] font-bold text-md md:text-base">
                      (
                      <span className="text-[#08705C]">
                        4 paid days yet to assign
                      </span>
                      )
                    </p>
                  </div>

                  <div className="flex-col space-y-4 ">
                    {data.monthlySlabs.map((slab, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center w-full md:w-[80%] xl:w-[70%] 2xl:w-[50%] justify-between mb-4"
                      >
                        <div className="flex items-center w-full md:w-1/2 justify-between">
                          <Text>Earn</Text>
                          <div className="flex items-center bg-white px-3 rounded-xl border-2 border-[#D1E9FF]">
                            <Input
                              type="number"
                              value={slab.earn}
                              onChange={(e) =>
                                setData((prev) => ({
                                  ...prev,
                                  monthlySlabs: prev.monthlySlabs.map((s, i) =>
                                    i === index
                                      ? { ...s, earn: e.target.value }
                                      : s
                                  ),
                                }))
                              }
                              w="75px"
                              border="none"
                              _focus={{ borderColor: "transparent" }}
                              _focusVisible={{
                                outline: "none",
                              }}
                            />
                            <Text
                              fontSize={{ base: 12, md: 16 }}
                              color="#9A9B9D"
                            >
                              (days)
                            </Text>
                          </div>
                        </div>
                        <div className="flex items-center w-full md:w-1/2 justify-between">
                          <Text>if employee works for at least</Text>
                          <div className="flex items-center bg-white px-3 rounded-xl border-2 border-[#D1E9FF]">
                            <Input
                              type="number"
                              value={slab.days}
                              onChange={(e) =>
                                setData((prev) => ({
                                  ...prev,
                                  monthlySlabs: prev.monthlySlabs.map((s, i) =>
                                    i === index
                                      ? { ...s, days: e.target.value }
                                      : s
                                  ),
                                }))
                              }
                              w="75px"
                              border="none"
                              _focus={{ borderColor: "transparent" }}
                              _focusVisible={{
                                outline: "none",
                              }}
                            />
                            <Text
                              fontSize={{ base: 12, md: 16 }}
                              color="#9A9B9D"
                            >
                              (days)
                            </Text>
                          </div>
                        </div>
                        {data.monthlySlabs.length > 1 && (
                          <Button
                            borderWidth={{ base: 1, md: 0 }}
                            borderColor={{
                              base: "#08705C",
                              md: "transparent",
                            }}
                            w={{ base: "100%", md: "auto" }}
                            bg="white"
                            icon={MdClose}
                            _hover={{ bg: "#F2F3F3" }}
                            iconPosition="left"
                            color="#08705C"
                            onClick={() =>
                              setData((prev) => ({
                                ...prev,
                                monthlySlabs: prev.monthlySlabs.filter(
                                  (_, i) => i !== index
                                ),
                              }))
                            }
                          >
                            Remove Slab
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      bg="white"
                      icon={FiPlus}
                      _hover={{ bg: "#F2F3F3" }}
                      iconPosition="left"
                      color="#08705C"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          monthlySlabs: [
                            ...prev.monthlySlabs,
                            { earn: "", days: "" },
                          ],
                        }))
                      }
                    >
                      Add Slab
                    </Button>
                  </div>
                </div>
              </div>
            )}
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

          <div className="flex flex-col md:flex-row items-start md:items-center">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
              mb={{ base: 4, md: 0 }}
            >
              Applicable for the genders
            </Text>

            {["Male", "Female"].map((unit) => (
              <Checkbox
                key={unit}
                defaultChecked={data.applicableFor.includes(unit)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setData((prev) => ({
                      ...prev,
                      applicableFor: [...prev.applicableFor, unit],
                    }));
                  } else {
                    setData((prev) => ({
                      ...prev,
                      applicableFor: prev.applicableFor.filter(
                        (item) => item !== unit
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

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Applicable after
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.applicableAfter}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    applicableAfter: e.target.value,
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
              from date of joining
            </Text>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Must be planned in advance by
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.mustBePlannedInAdvanceBy}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    mustBePlannedInAdvanceBy: e.target.value,
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

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Max. days in a stretch
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.maxDaysInAStretch}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    maxDaysInAStretch: e.target.value,
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
              color="#9A9B9D"
              ml={{ md: 4 }}
            >
              If the value is 0, It is understood that there is no limit.
            </Text>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Min days required for a leave
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.minDaysRequiredForALeave}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    minDaysRequiredForALeave: e.target.value,
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

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Max instances
            </Text>

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
              w={{ base: "100%", md: "15%" }}
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
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#9A9B9D"
              ml={{ md: 4 }}
            >
              If the value is 0, It is understood that there is no limit.
            </Text>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Leaves immediately before and after a weekend are
            </Text>

            <Tabs
              value={data.leavesImmediatelyBeforeAndAfterAWeekend}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  leavesImmediatelyBeforeAndAfterAWeekend: value,
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
              Leaves immediately before and after a holiday are
            </Text>

            <Tabs
              value={data.leavesImmediatelyBeforeAndAfterAHoliday}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  leavesImmediatelyBeforeAndAfterAHoliday: value,
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
              Clubbing with other leave types is
            </Text>

            <Tabs
              value={data.clubbingWithOtherLeaveTypes}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  clubbingWithOtherLeaveTypes: value,
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

          <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
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
                w="100%"
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

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              During notice period, leaves are
            </Text>

            <Tabs
              value={data.leavesDuringNoticePeriod}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  leavesDuringNoticePeriod: value,
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

          <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Does this require a review workflow for approval?
            </Text>

            <div className="w-full md:w-[60%]">
              <Tabs
                value={data.requiresReviewWorkflow}
                onValueChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    requiresReviewWorkflow: value,
                  }))
                }
                className="bg-white rounded-xl py-1.5 w-fit"
              >
                <TabsList className="space-x-1 bg-white">
                  <TabsTrigger value="workflow">Workflow</TabsTrigger>
                  <TabsTrigger value="noWorkflow">No Workflow</TabsTrigger>
                </TabsList>
              </Tabs>
              {data.requiresReviewWorkflow === "noWorkflow" && (
                <Text fontSize={{ base: 14, md: 16 }} color="#000" mt={4}>
                  If you select "No workflow" then leave will be auto-approved
                  and leave balance will be deducted immediately.
                </Text>
              )}
            </div>
          </div>

          {data.requiresReviewWorkflow === "workflow" && (
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
              <Text
                fontSize={{ base: 14, md: 16 }}
                color="#383838"
                w={{ base: "100%", md: "40%" }}
              >
                Leave balance is deducted
              </Text>

              <Tabs
                value={data.deductBalanceBeforeWorkflow}
                onValueChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    deductBalanceBeforeWorkflow: value,
                  }))
                }
                className="bg-white rounded-xl py-1.5 w-fit"
              >
                <TabsList className="space-x-1 bg-white">
                  <TabsTrigger value="beforeWorkflow">
                    Before the workflow
                  </TabsTrigger>
                  <TabsTrigger value="afterWorkflow">
                    After the workflow
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {/* 
              {["Before the workflow", "After the workflow"].map((unit) => (
                <Checkbox
                  key={unit}
                  defaultChecked={data.deductBalanceBeforeWorkflow.includes(
                    unit
                  )}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData((prev) => ({
                        ...prev,
                        deductBalanceBeforeWorkflow: [
                          ...prev.deductBalanceBeforeWorkflow,
                          unit,
                        ],
                      }));
                    } else {
                      setData((prev) => ({
                        ...prev,
                        deductBalanceBeforeWorkflow:
                          prev.deductBalanceBeforeWorkflow.filter(
                            (item) => item !== unit
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
              ))} */}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Grace period for applying
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.gracePeriodForApplying}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    gracePeriodForApplying: e.target.value,
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

          {/* <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Withdrawal of application is allowed
            </Text>

            {["Before approval", "After approval"].map((unit) => (
              <Checkbox
                key={unit}
                defaultChecked={data.withdrawalOfApplicationAllowed.includes(
                  unit
                )}
                onChange={(e) => {
                  if (e.target.checked) {
                    setData((prev) => ({
                      ...prev,
                      withdrawalOfApplicationAllowed: [
                        ...prev.withdrawalOfApplicationAllowed,
                        unit,
                      ],
                    }));
                  } else {
                    setData((prev) => ({
                      ...prev,
                      withdrawalOfApplicationAllowed:
                        prev.withdrawalOfApplicationAllowed.filter(
                          (item) => item !== unit
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
          </div> */}

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Withdrawal of application is allowed
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
                  Before approval
                </TabsTrigger>
                <TabsTrigger value="afterApproval">After approval</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Negative leave balance is allowed up to
            </Text>

            <div className="flex items-center bg-white px-3 rounded-xl">
              <Input
                type="number"
                value={data.negativeLeaveBalanceAllowedUpTo}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    negativeLeaveBalanceAllowedUpTo: e.target.value,
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

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Carry forward limit
            </Text>

            <div className="flex items-center w-full md:w-[60%]">
              <Select
                w={{ base: "100%", md: "30%" }}
                bg="white"
                h="44px"
                borderRadius="12px"
                value={data.carryForwardLimit.duration}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    carryForwardLimit: {
                      ...prev.carryForwardLimit,
                      duration: e.target.value,
                    },
                  }))
                }
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Select>
              <div className="flex items-center bg-white px-3 rounded-xl ml-5">
                <Input
                  type="number"
                  value={data.carryForwardLimit.limit}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      carryForwardLimit: {
                        ...prev.carryForwardLimit,
                        limit: e.target.value,
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
            </div>
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="flex-col bg-[#F2F3F3] p-5 rounded-lg space-y-5">
          <div className="flex items-center justify-between">
            <Text
              fontWeight={700}
              fontSize={{ base: 14, md: 24 }}
              color="#383838"
            >
              En-cashment
            </Text>
            <Switch
              colorScheme="green"
              defaultChecked={data.enCashment}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  enCashment: e.target.checked,
                }))
              }
              sx={{
                "& .chakra-switch__track[data-checked]": {
                  backgroundColor: "#08705C",
                },
              }}
            />
          </div>

          <FadeOut.FadeOut isVisible={data.enCashment}>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 mb-5">
              <Text
                fontSize={{ base: 14, md: 16 }}
                color="#383838"
                w={{ base: "100%", md: "40%" }}
              >
                Calculate en-cashment using
              </Text>

              {["Basic / DA", "CTC", "Gross Salary"].map((unit) => (
                <Checkbox
                  key={unit}
                  defaultChecked={data.enCashmentCalculation.includes(unit)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData((prev) => ({
                        ...prev,
                        enCashmentCalculation: [
                          ...prev.enCashmentCalculation,
                          unit,
                        ],
                      }));
                    } else {
                      setData((prev) => ({
                        ...prev,
                        enCashmentCalculation:
                          prev.enCashmentCalculation.filter(
                            (item) => item !== unit
                          ),
                      }));
                    }
                  }}
                  mr={6}
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

            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 mb-5">
              <Text
                fontSize={{ base: 14, md: 16 }}
                color="#383838"
                w={{ base: "100%", md: "40%" }}
              >
                Max. days that can be en-cashed
              </Text>

              <div className="flex items-center bg-white px-3 rounded-xl">
                <Input
                  type="number"
                  value={data.maxDaysEnCashable}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      maxDaysEnCashable: e.target.value,
                    }))
                  }
                  w={{ base: "100%", md: "75px" }}
                  border="none"
                  _focus={{ borderColor: "transparent" }}
                  _focusVisible={{
                    outline: "none",
                  }}
                />
                <Text fontSize={{ base: 12, md: 16 }} color="#9A9B9D">
                  (days)
                </Text>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 mb-5">
              <Text
                fontSize={{ base: 14, md: 16 }}
                color="#383838"
                w={{ base: "100%", md: "40%" }}
              >
                Leaves can be en-cashed at
              </Text>

              <Tabs
                value={data.enCashmentAt}
                onValueChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    enCashmentAt: value,
                  }))
                }
                className="bg-white rounded-xl py-1.5 w-fit"
              >
                <TabsList className="space-x-1 bg-white">
                  <TabsTrigger value="exit">Exit/ Retirement</TabsTrigger>
                  <TabsTrigger value="annually">Annually</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </FadeOut.FadeOut>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <div className="flex-col bg-[#F2F3F3] p-5 rounded-lg space-y-5 ">
          <Text
            fontWeight={700}
            fontSize={{ base: 14, md: 24 }}
            color="#383838"
          >
            Other Settings
          </Text>

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 mb-5">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Allow applications on behalf of others
            </Text>

            <Tabs
              value={data.allowApplicationsOnBehalfOfOthers}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  allowApplicationsOnBehalfOfOthers: value,
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

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 mb-5">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Leave data to be shown in Payslips
            </Text>

            {["Availed leaves", "Balance leaves"].map((unit) => (
              <Checkbox
                key={unit}
                defaultChecked={data.showLeaveDataInPayslips.includes(unit)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setData((prev) => ({
                      ...prev,
                      showLeaveDataInPayslips: [
                        ...prev.showLeaveDataInPayslips,
                        unit,
                      ],
                    }));
                  } else {
                    setData((prev) => ({
                      ...prev,
                      showLeaveDataInPayslips:
                        prev.showLeaveDataInPayslips.filter(
                          (item) => item !== unit
                        ),
                    }));
                  }
                }}
                mr={6}
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

          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 mb-5">
            <Text
              fontSize={{ base: 14, md: 16 }}
              color="#383838"
              w={{ base: "100%", md: "40%" }}
            >
              Allow as a planned leave
            </Text>

            <Tabs
              value={data.allowAsPlannedLeave}
              onValueChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  allowAsPlannedLeave: value,
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
            {editMode ? "Update Leave Variant" : "Create Leave Variant"}
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
