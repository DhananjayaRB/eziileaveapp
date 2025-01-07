"use client";

import { Employee } from "@/lib/types";
import { Text } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../core/data-table-column-header";

export const columns: ColumnDef<Employee>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "employee_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee Number" />
    ),
  },
  {
    accessorKey: "user_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "designation_name",
    header: () => (
      <Text className="font-bold" color="black">
        Designation
      </Text>
    ),
  },
  //   Place Function here
  {
    accessorKey: "type_id_1",
    header: () => (
      <Text className="font-bold" color="black">
        Department
      </Text>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type_id_2",
    header: () => (
      <Text className="font-bold" color="black">
        Division
      </Text>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type_id_0",
    header: () => (
      <Text className="font-bold" color="black">
        Location
      </Text>
    ),
  },
  {
    accessorKey: "type_id_8",
    header: () => (
      <Text className="font-bold" color="black">
        Customer
      </Text>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "type_id_9",
    header: () => (
      <Text className="font-bold" color="black">
        Process
      </Text>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "type_id_11",
    header: () => (
      <Text className="font-bold" color="black">
        Sub-Process
      </Text>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "type_id_16",
    header: () => (
      <Text className="font-bold" color="black">
        Sub Location
      </Text>
    ),
  },
  {
    accessorKey: "type_id_18",
    header: () => (
      <Text className="font-bold" color="black">
        Org State
      </Text>
    ),
  },
  {
    accessorKey: "worker_type",
    header: () => (
      <Text className="font-bold" color="black">
        Contract Type
      </Text>
    ),
  },
];
