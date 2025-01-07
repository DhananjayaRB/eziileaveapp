import { employeeLeaveDetailsAtom } from "@/atoms/employee-atom";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { useResolveAPI } from "@/hooks/resolve";
import {
  BereavementLeaveIcon,
  CasualLeaveIcon,
  EarnedLeaveIcon,
  MarriageLeaveIcon,
  MaternityLeaveIcon,
  PaternityLeaveIcon,
  SickLeaveIcon,
} from "@/icons/leaves";
import { Employee, LeaveForm } from "@/lib/types";
import {
  Checkbox,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { PopoverTrigger } from "@radix-ui/react-popover";
import cn from "classnames";
import { CalendarIcon, TrashIcon } from "lucide-react";
import { useRecoilValue } from "recoil";
import { Button } from "../ui/button";
import { EmployeeCombobox } from "../ui/employee-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button as CoreButton } from "../core/button";
import { BsUpload } from "react-icons/bs";
import { useRef } from "react";
import { CiTrash } from "react-icons/ci";
import { FaPlus, FaTrash } from "react-icons/fa";
import WarningModal from "../modal/warning";

interface Props {
  data: LeaveForm;
  setData: (value: React.SetStateAction<LeaveForm>) => void;
  loading: boolean;
  onSubmit: () => Promise<void>;
  onDiscard: () => void;
}

const iconMapping = {
  "Sick Leave": SickLeaveIcon,
  "Casual Leave": CasualLeaveIcon,
  "Earned Leave": EarnedLeaveIcon,
  "Maternity Leave": MaternityLeaveIcon,
  "Paternity Leave": PaternityLeaveIcon,
  "Marriage Leave": MarriageLeaveIcon,
  "Bereavement Leave": BereavementLeaveIcon,
};

const colorMapping = {
  "Sick Leave": "#FF95001A",
  "Casual Leave": "#34C7591A",
  "Earned Leave": "#007AFF1A",
  "Maternity Leave": "#FF2D551A",
  "Paternity Leave": "#5856D61A",
  "Marriage Leave": "#AF52DE1A",
  "Bereavement Leave": "#CCCDCE",
};

const transformUsers = (users: Employee[]) => {
  return users.map((user) => ({
    value: user.employee_number,
    label: user.user_name,
  }));
};

export function ApplyForLeaveForm({
  data,
  setData,
  loading,
  onSubmit,
  onDiscard,
}: Props) {
  const employeeLeaveDetails = useRecoilValue(employeeLeaveDetailsAtom);
  const { employees } = useResolveAPI();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map((file) => {
      const nameWithoutExtension = file.name.split(".").slice(0, -1).join(".");
      const extension = file.name.split(".").pop()?.toUpperCase() || "";
      const formattedName = nameWithoutExtension.replace(/\s+/g, "-");
      return `${formattedName} (${extension})`;
    });

    setData((prev) => ({
      ...prev,
      supportingDocuments: [...prev.supportingDocuments, ...newFiles],
    }));

    e.target.value = "";
  };

  return (
    <div className="flex flex-col space-y-5 h-[70vh] overflow-y-auto">
      <div className="flex flex-col md:flex-row items-center justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
        {/* <div className="w-full md:w-1/2">planned leaves</div> */}
        <div className="w-full md:w-1/2 flex flex-col space-y-2">
          <Text
            fontWeight={700}
            color="#383838"
            fontSize={{ md: "16px", lg: "18px" }}
          >
            Leave type
          </Text>

          <Select
            value={data.leaveType}
            onValueChange={(value) => {
              setData((prev) => ({ ...prev, leaveType: value }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Leave Type" />
            </SelectTrigger>
            <SelectContent side="bottom" className="z-[9999]">
              {employeeLeaveDetails.leaves.map((l) => (
                <SelectItem key={l.id} value={`${l.id}`}>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`bg-[${
                        colorMapping[l.name as keyof typeof colorMapping]
                      }] w-6 h-6 rounded-full flex items-center justify-center mr-2`}
                    >
                      <Icon
                        as={iconMapping[l.name as keyof typeof iconMapping]}
                        fontSize={12}
                      />
                    </div>
                    {l.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2 flex flex-col space-y-2">
          <Text
            fontWeight={700}
            color="#383838"
            fontSize={{ md: "16px", lg: "18px" }}
          >
            Start date
          </Text>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.startDate.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {data.startDate.date ? (
                  `${new Date(data.startDate.date!).toLocaleDateString()}`
                ) : (
                  <Text color="#383838" fontSize={{ md: "14px", lg: "16px" }}>
                    Pick a date
                  </Text>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[9999]" align="start">
              <Calendar
                className="z-[9999]"
                mode="single"
                selected={
                  data.startDate.date
                    ? new Date(data.startDate.date)
                    : undefined
                }
                onSelect={(value: Date | undefined) =>
                  setData((prev) => ({
                    ...prev,
                    startDate: value
                      ? { date: value.toISOString() }
                      : { date: null },
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex flex-col space-y-4 p-3">
            <Checkbox
              defaultChecked={data.startDate.halfDay}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  startDate: {
                    ...prev.startDate,
                    halfDay: e.target.checked,
                  },
                }));
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
                fontSize={{ base: 14, md: 16 }}
                color="#000"
                fontWeight={600}
              >
                Half day
              </Text>
            </Checkbox>

            {data.startDate.halfDay && (
              <RadioGroup
                onChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    startDate: {
                      ...prev.startDate,
                      whichHalf: value,
                    },
                  }))
                }
                value={data.startDate.whichHalf}
              >
                <Stack direction="row">
                  <Radio value="first">First Half</Radio>
                  <Radio value="second">Second-half</Radio>
                </Stack>
              </RadioGroup>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col space-y-2">
          <Text
            fontWeight={700}
            color="#383838"
            fontSize={{ md: "16px", lg: "18px" }}
          >
            End date
          </Text>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.endDate.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {data.endDate.date ? (
                  `${new Date(data.endDate.date!).toLocaleDateString()}`
                ) : (
                  <Text color="#383838" fontSize={{ md: "14px", lg: "16px" }}>
                    Pick a date
                  </Text>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[9999]" align="start">
              <Calendar
                className="z-[9999]"
                mode="single"
                selected={
                  data.endDate.date ? new Date(data.endDate.date) : undefined
                }
                onSelect={(value: Date | undefined) =>
                  setData((prev) => ({
                    ...prev,
                    endDate: value
                      ? { date: value.toISOString() }
                      : { date: null },
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex flex-col space-y-4 p-3">
            <Checkbox
              defaultChecked={data.endDate.halfDay}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  endDate: {
                    ...prev.endDate,
                    halfDay: e.target.checked,
                  },
                }));
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
                fontSize={{ base: 14, md: 16 }}
                color="#000"
                fontWeight={600}
              >
                Half day
              </Text>
            </Checkbox>

            {data.endDate.halfDay && (
              <RadioGroup
                onChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    endDate: {
                      ...prev.endDate,
                      whichHalf: value,
                    },
                  }))
                }
                value={data.endDate.whichHalf}
              >
                <Stack direction="row">
                  <Radio value="first">First Half</Radio>
                  <Radio value="second">Second-half</Radio>
                </Stack>
              </RadioGroup>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
        <Checkbox
          defaultChecked={data.behalfOfSomeoneElse.isSelected}
          onChange={(e) => {
            setData((prev) => ({
              ...prev,
              behalfOfSomeoneElse: {
                isSelected: e.target.checked,
              },
            }));
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
          <Text fontSize={{ base: 14, md: 16 }} color="#000" fontWeight={600}>
            Apply on behalf of someone else
          </Text>
        </Checkbox>

        {data.behalfOfSomeoneElse.isSelected && (
          <div className="w-full md:w-[50%]">
            <EmployeeCombobox
              options={transformUsers(employees)}
              placeholder={
                data.behalfOfSomeoneElse.employee
                  ? data.behalfOfSomeoneElse.employee.user_name
                  : "Employee"
              }
              selectedOptions={
                data.behalfOfSomeoneElse.employee?.employee_number
                  ? [data.behalfOfSomeoneElse.employee.employee_number]
                  : []
              }
              onSelect={(selected) => {
                setData((prev) => ({
                  ...prev,
                  behalfOfSomeoneElse: {
                    ...prev.behalfOfSomeoneElse,
                    employee: employees.find(
                      (e) => e.employee_number === selected
                    ),
                  },
                }));
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-start justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2 flex flex-col space-y-2">
          <Text
            fontWeight={700}
            color="#383838"
            fontSize={{ md: "16px", lg: "18px" }}
          >
            Reason for leave
          </Text>

          <Select
            value={data.reasonForLeave}
            onValueChange={(value) => {
              setData((prev) => ({ ...prev, reasonForLeave: value }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Reason for Leave" />
            </SelectTrigger>
            <SelectContent side="bottom" className="z-[9999]">
              <SelectItem value={"health"}>Health</SelectItem>
              <SelectItem value={"family"}>Family</SelectItem>
              <SelectItem value={"other"}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/2 flex flex-col space-y-2">
          <Text
            fontWeight={700}
            color="#383838"
            fontSize={{ md: "16px", lg: "18px" }}
          >
            Description
          </Text>

          <Textarea
            value={data.description}
            onChange={(e) => {
              setData((prev) => ({ ...prev, description: e.target.value }));
            }}
            placeholder="eg. Migraine"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full flex flex-col space-y-2">
          <Text
            fontWeight={700}
            color="#383838"
            fontSize={{ md: "16px", lg: "18px" }}
          >
            Documents
          </Text>
          <Text
            fontWeight={400}
            color="#676A6C"
            fontSize={{ md: "16px", lg: "18px" }}
          >
            Upload relevant documents that include medical certificates etc.
          </Text>
        </div>

        <div className="w-full md:w-1/5 flex flex-col space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <CoreButton
            variant={"outline"}
            py={3}
            icon={BsUpload}
            iconPosition="right"
            onClick={handleUploadClick}
          >
            Upload
          </CoreButton>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {data.supportingDocuments.map((document, index) => (
          <div
            key={index}
            className="flex items-center border border-[#E6E6E7] rounded-md px-3 py-4 text-sm"
          >
            <span className="text-black font-semibold">{document}</span>
            <button
              className="ml-2 text-gray-500 hover:text-red-500"
              onClick={() => {
                setData((prev) => ({
                  ...prev,
                  supportingDocuments: prev.supportingDocuments.filter(
                    (_, i) => i !== index
                  ),
                }));
              }}
            >
              <CiTrash className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-start justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-1/2 flex flex-col space-y-2">
          <Text
            fontWeight={700}
            color="#383838"
            fontSize={{ md: "16px", lg: "18px" }}
          >
            Assign Tasks
          </Text>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-end justify-end space-y-2">
          <button
            onClick={() => {
              setData((prev) => ({
                ...prev,
                assignTasks: [
                  ...prev.assignTasks,
                  { person: { user_name: "", employee_number: "" }, task: "" },
                ],
              }));
            }}
            className="text-[#08705C] hover:text-[#065a49] transition-colors"
          >
            <FaPlus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {data.assignTasks.map((task, index) => (
        <div
          key={index}
          className="w-full flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 p-4 border border-gray-200 rounded-lg"
        >
          <div className="w-full md:w-[85%] flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-[30%]">
              <EmployeeCombobox
                options={transformUsers(employees)}
                width="100%"
                placeholder={
                  task.person.user_name
                    ? task.person.user_name
                    : data.behalfOfSomeoneElse.isSelected
                    ? "Tag Employee"
                    : "Tag Manager"
                }
                selectedOptions={[task.person.employee_number]}
                onSelect={(selected) => {
                  setData((prev) => ({
                    ...prev,
                    assignTasks: prev.assignTasks.map((t, i) =>
                      i === index
                        ? {
                            ...t,
                            person:
                              employees.find(
                                (e) => e.employee_number === selected
                              ) || t.person,
                          }
                        : t
                    ),
                  }));
                }}
              />
            </div>
            <div className="w-full md:w-[70%]">
              <Textarea
                value={task.task}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    assignTasks: prev.assignTasks.map((t, i) =>
                      i === index ? { ...t, task: e.target.value } : t
                    ),
                  }));
                }}
                placeholder="Enter task"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setData((prev) => ({
                ...prev,
                assignTasks: prev.assignTasks.filter((_, i) => i !== index),
              }));
            }}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
      ))}

      <div className="flex flex-col-reverse md:flex-row items-center justify-end md:space-y-0 md:space-x-5 p-5">
        <CoreButton
          variant="outline"
          icon={FaTrash}
          iconPosition="right"
          w={{ base: "100%", md: "auto" }}
          py={{ base: 4 }}
          onClick={() => onOpen()}
        >
          Discard
        </CoreButton>
        <CoreButton
          onClick={() => {
            onSubmit();
          }}
          isLoading={loading}
          w={{ base: "100%", md: "auto" }}
          py={{ base: 4 }}
          mb={{ base: 4, md: 0 }}
        >
          Apply for Leave
        </CoreButton>
      </div>

      <WarningModal
        isOpen={isOpen}
        onClose={onClose}
        heading="Discard Changes"
        description="Are you sure you want to discard all changes?"
        onConfirm={onDiscard}
      />
    </div>
  );
}
