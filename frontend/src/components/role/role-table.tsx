"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Employee, Role } from "@/lib/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setSelectedRoles: (roles: { id: number; name: string }[]) => void;
  clearSelection?: boolean;
  selectedRoles?: { id: number; name: string }[];
}

export function RolesTable<TData, TValue>({
  columns,
  data,
  setSelectedRoles,
  clearSelection = false,
  selectedRoles = [],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (clearSelection) {
      setRowSelection({});
    }
  }, [clearSelection]);

  // useEffect(() => {
  //   if (selectedUsers.length > 0) {
  //     const newRowSelection: Record<number, boolean> = {};
  //     data.forEach((row, index) => {
  //       const employee = row as Employee;
  //       if (selectedUsers.includes(employee.employee_number)) {
  //         newRowSelection[index] = true;
  //       }
  //     });
  //     setRowSelection(newRowSelection);
  //   }
  // }, [selectedUsers, data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedRoleIds = selectedRows.map((row) => {
      const role = row.original as Role;
      return { id: role.id, name: role.roleName };
    });
    setSelectedRoles(selectedRoleIds as { id: number; name: string }[]);
  }, [rowSelection, table, setSelectedRoles]);

  return (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
