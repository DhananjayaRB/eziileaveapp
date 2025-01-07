"use client";

import {
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { CiFilter } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { Button } from "../core/button";
import FiltersModal from "../modal/filters";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterCount: number;
}

export function DataTableToolbar<TData>({
  table,
  filterCount,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const {
    isOpen: isFiltersOpen,
    onOpen: onFiltersOpen,
    onClose: onFiltersClose,
  } = useDisclosure();
  //   console.log(organisationStructure?.configs.sub_types);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 flex-1 items-center space-x-2">
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
            placeholder="Search for employees"
            value={
              (table.getColumn("user_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("user_name")?.setFilterValue(event.target.value)
            }
            _focus={{ borderColor: "transparent" }}
            _focusVisible={{
              outline: "none",
            }}
          />
        </InputGroup>
        {table.getColumn("designation_name") && (
          <Button
            variant="outline"
            size="sm"
            icon={!isFiltered ? CiFilter : undefined}
            iconPosition="right"
            w={{ base: "100%", md: "auto" }}
            px={2}
            onClick={onFiltersOpen}
          >
            {filterCount > 0 ? `(${filterCount}) Filters` : "Apply Filters"}
          </Button>
        )}
        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            w={{ base: "100%", md: "auto" }}
            px={1}
            py={1}
            onClick={() => table.resetColumnFilters()}
          >
            Clear Filters
            <X />
          </Button>
        )}
      </div>

      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={onFiltersClose}
        table={table}
      />
    </div>
  );
}
