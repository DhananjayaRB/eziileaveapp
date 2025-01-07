import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Alert,
  Button,
  Center,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Box, CalendarIcon } from "lucide-react";
import { Button as CoreButton } from "../core/button";
import WarningModal from "../modal/warning";
import { CompOffForm } from "@/lib/types";

interface Props {
  data: CompOffForm;
  setData: (value: React.SetStateAction<CompOffForm>) => void;
  loading: boolean;
  // setLoading: Dispatch<SetStateAction<boolean>>;
  onSubmit: () => Promise<void>;
  onDiscard: () => void;
}

export function ApplyForCompOffForm({
  data,
  setData,
  loading,
  // setLoading,
  onSubmit,
  onDiscard,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="flex flex-col space-y-5 h-[70vh] overflow-y-auto">
      <Center bg="bg.emphasized" h="100px" maxW="320px">
        <Box>15</Box>
        <Box>Total Bank</Box>
      </Center>
      <Center bg="bg.emphasized" h="100px" maxW="320px">
        <Box>5</Box>
        <Box>Availed</Box>
      </Center>
      <Center bg="bg.emphasized" h="100px" maxW="320px">
        <Box>10</Box>
        <Box>Balance</Box>
      </Center>

      <div className="flex flex-col md:flex-row items-start justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2 flex flex-col space-y-2">
          <Text fontWeight={700} color="#383838" fontSize={{ md: "16px", lg: "18px" }}>
            Date
          </Text>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !data.date && "text-muted-foreground"
                }`}
              >
                <CalendarIcon />
                {data.date ? (
                  `${new Date(data.date).toLocaleDateString()}`
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
                selected={data.date ? new Date(data.date) : undefined}
                onSelect={(value) =>
                  setData((prev) => ({
                    ...prev,
                    date: value ? value.toISOString() : "",
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full md:w-1/2 flex flex-col space-y-2">
          <Text fontWeight={700} color="#383838" fontSize={{ md: "16px", lg: "18px" }}>
            From (Time)
          </Text>
          <input
            type="time"
            className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data.fromTime || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                fromTime: e.target.value,
              }))
            }
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col space-y-2">
          <Text fontWeight={700} color="#383838" fontSize={{ md: "16px", lg: "18px" }}>
            To (Time)
          </Text>
          <input
            type="time"
            className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data.toTime || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                toTime: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <Alert status="info" title="Applying for a (HALF DAY 3H) comp-off on Sat, 03 Jun 2024" />

      <div className="flex flex-col md:flex-row items-start justify-between w-full space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full flex flex-col space-y-2">
          <Text fontWeight={700} color="#383838" fontSize={{ md: "16px", lg: "18px" }}>
            Reason For Comp-off
          </Text>
          <Textarea
            value={data.reasonForCompOff}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                reasonForCompOff: e.target.value,
              }))
            }
            placeholder="Enter Reason Here..."
          />
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center justify-end md:space-y-0 md:space-x-5 p-5">
        <CoreButton
          variant="outline"
          w={{ base: "100%", md: "auto" }}
          py={{ base: 4 }}
          onClick={onOpen}
        >
          Discard
        </CoreButton>
        <CoreButton
          onClick={onSubmit}
          isLoading={loading}
          w={{ base: "100%", md: "auto" }}
          py={{ base: 4 }}
          mb={{ base: 4, md: 0 }}
        >
          Apply for Comp-off
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
