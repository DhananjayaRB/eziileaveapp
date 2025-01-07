"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { AssignedTo, Employee } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { DataTablePagination } from "../core/data-table-pagination";
import { DataTableToolbar } from "./users-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setSelectedUsers: (users: AssignedTo[]) => void;
  clearSelection?: boolean;
  selectedUsers?: AssignedTo[];
}

export function UsersTable<TData, TValue>({
  columns,
  data,
  setSelectedUsers,
  clearSelection = false,
  selectedUsers,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    if (selectedUsers && selectedUsers.length > 0 && data.length > 0) {
      const initialSelection: Record<string, boolean> = {};
      data.forEach((row: any, index) => {
        if (
          selectedUsers.some(
            (selected) => selected.employee_number === row.employee_number
          )
        ) {
          initialSelection[index] = true;
        }
      });
      setRowSelection(initialSelection);
    }
  }, [selectedUsers, data]);

  useEffect(() => {
    if (clearSelection) {
      setRowSelection({});
    }
  }, [clearSelection]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility: {
        type_id_8: false, // Customer
        type_id_9: false, // Process
        type_id_11: false, // Sub-Process
        type_id_16: false, // Sub Location
        type_id_18: false, // Org State
        worker_type: false, // Contract Type
        employee_number: false, // Employee Number
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedUserIds = selectedRows.map((row) => {
      const employee = row.original as Employee;
      return {
        employee_number: employee.employee_number,
        name: employee.user_name,
      };
    });
    setSelectedUsers(selectedUserIds);
  }, [rowSelection, table, setSelectedUsers]);

  return (
    <div className="w-full">
      <DataTableToolbar table={table} filterCount={columnFilters.length} />
      <div className="mt-2 rounded-md border w-full h-[65%] md:h-[80%] overflow-y-auto">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
