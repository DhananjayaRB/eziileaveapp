import { Employee } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { Textarea, Text } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

interface Props {
  employees: Employee[];
  value: string;
  onChange: (value: string) => void;
  onMention: (employee: Employee) => void;
}

export function MentionTextarea({
  employees,
  value,
  onChange,
  onMention,
}: Props) {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    setCursorPosition(cursorPos);

    // Check if we should show mentions
    const lastChar = newValue.charAt(cursorPos - 1);
    const prevChar = newValue.charAt(cursorPos - 2);

    if (
      lastChar === "@" &&
      (prevChar === " " || prevChar === "" || prevChar === "\n")
    ) {
      setShowMentions(true);
      setMentionFilter("");
    } else if (showMentions) {
      const mentionText = getMentionText(newValue, cursorPos);
      setMentionFilter(mentionText);
    }

    onChange(newValue);
  };

  const getMentionText = (text: string, cursorPos: number): string => {
    const beforeCursor = text.slice(0, cursorPos);
    const atIndex = beforeCursor.lastIndexOf("@");
    return beforeCursor.slice(atIndex + 1);
  };

  const handleSelectMention = (employee: Employee) => {
    const beforeMention = value.slice(
      0,
      cursorPosition - mentionFilter.length - 1
    );
    const afterMention = value.slice(cursorPosition);
    const newValue = `${beforeMention}@${employee.user_name} ${afterMention}`;

    onChange(newValue);
    setShowMentions(false);
    onMention(employee);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.user_name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        placeholder="Enter task"
        width={{ base: "100%", md: "90%" }}
      />

      {showMentions && (
        <Popover open={true}>
          <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
            <Command>
              <CommandGroup>
                {filteredEmployees.map((employee) => (
                  <CommandItem
                    key={employee.employee_number}
                    onSelect={() => handleSelectMention(employee)}
                  >
                    <Text>{employee.user_name}</Text>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
