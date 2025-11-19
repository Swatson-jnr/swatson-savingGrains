"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import "flatpickr/dist/themes/material_blue.css";
import { ArrowLeft, ArrowRight, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-flatpickr";
import OverviewModalContent from "../../overview/components/overview-modal-content";
import InventoryStatusBadge from "./status-badge";
import Title from "@/components/title";
import FilterDropdown from "@/app/payments/fund-requests/components/filter-dropdown";
import Modal from "@/components/modal";

type tableData = {
  transferType: string;
  status: string;
  weight: string;
  grainType: string;
  date: string;
  role: string;
  initiatedBy: string;
};

interface TableProps {
  tableDetails: tableData[];
}

export default function InventoryTable({ tableDetails }: TableProps) {
  const [isOpen, setIsOpen] = useState(false);
  // const [data] = useState(() => [...tableDetails]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGloablFilter] = useState("");
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const columnHelper = createColumnHelper<tableData>();
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [activityFilter, setActivityFilter] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<tableData[]>(tableDetails);
  const data = filteredData;
  const expenses = {
    dateRecorded: "2025-10-01",
    paymentMethod: "Bank Transfer",
    businessLine: "Retail",
    expenseCategory: "Supplies",
    productLine: "Office Stationery",
    amount: "250.00",
    accountNumber: "2038456789",
    agentName: "Janet Owusu",
    role: "Procurement Officer",
    narration: "Purchased office stationery",
    weekOfTransaction: "Week 1",
    quantity: 5,
    unitPrice: "50.00",
  };

  const columns = [
    columnHelper.accessor("transferType", {
      cell: (info) => (
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="rounded-full bg-[#F2F3F5] p-1.5 sm:p-2">
            <img
              src={
                info.getValue() === "Receive"
                  ? "../img/arrow-down-right.svg"
                  : "../img/arrow-up-left.svg"
              }
              alt={info.getValue()}
              className="w-4 text-gray-500 sm:w-5"
            />
          </div>
          <span className="text-xs font-normal text-[#080808] sm:text-[13px] md:text-[14px]">
            {info.getValue()}
          </span>
        </div>
      ),
      header: () => <Title text="Transfer Type" level={7} weight="normal" />,
    }),
    columnHelper.accessor("date", {
      cell: (info) => (
        <span className="text-xs font-normal text-[#080808] sm:text-[13px] md:text-[14px]">
          {info.getValue()}
        </span>
      ),
      header: () => <Title text="Date" level={7} weight="normal" />,
    }),

    columnHelper.accessor("initiatedBy", {
      cell: (info) => (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F3F5] px-2.5 sm:h-9 sm:w-9 md:h-10 md:w-10">
            <span className="text-xs font-normal text-black sm:text-[13px] md:text-[15px]">
              {info
                .getValue()
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <span className="truncate text-sm font-normal text-[#080808] sm:text-[15px] md:text-[16px]">
            {info.getValue()}
          </span>
        </div>
      ),
      header: () => <Title text="Initiated By" level={7} weight="normal" />,
    }),
    columnHelper.accessor("role", {
      cell: (info) => (
        <span className="text-xs font-normal text-[#080808] sm:text-[13px] md:text-[14px]">
          {info.getValue()}
        </span>
      ),
      header: () => <Title text="Role" level={7} weight="normal" />,
    }),
    columnHelper.accessor("grainType", {
      cell: (info) => (
        <span className="text-xs font-normal text-[#080808] sm:text-[13px] md:text-[14px]">
          {info.getValue()}
        </span>
      ),
      header: () => <Title text="Grain Type" level={7} weight="normal" />,
    }),
    columnHelper.accessor("status", {
      cell: (info) => (
        <div className="flex items-center gap-2">
          <InventoryStatusBadge
            status={info.getValue() as "approved" | "declined" | "pending"}
          />
        </div>
      ),
      header: () => <Title text="Status" level={7} weight="normal" />,
    }),

    columnHelper.accessor("weight", {
      cell: (info) => (
        <span className="text-xs font-normal text-[#080808] sm:text-[13px] md:text-[16px]">
          {info.getValue()}
        </span>
      ),
      header: () => <Title text="Weight" level={7} weight="normal" />,
    }),
  ];

  const table = useReactTable<tableData>({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGloablFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const sort = [
    { id: "Admin", name: "Admin" },
    { id: "Paymaster", name: "Paymaster" },
    { id: "Field Agent", name: "Field Agent" },
  ];
  const status = [
    { id: "successful", name: "Successful" },
    { id: "failed", name: "Failed" },
  ];
  const payment = [
    { id: "Receive", name: "Receive" },
    { id: "Transfer", name: "Transfer" },
  ];
  const handleRoleFilter = (selectedIds: string[]) => {
    setRoleFilter(selectedIds);
  };

  const handleStatusFilter = (selectedIds: string[]) => {
    setStatusFilter(selectedIds);
  };

  const handleActivityFilter = (selectedIds: string[]) => {
    setActivityFilter(selectedIds);
  };

  useEffect(() => {
    let result = [...tableDetails];
    if (roleFilter.length > 0) {
      result = result.filter((row) => roleFilter.includes(row.role));
    }
    if (statusFilter.length > 0) {
      result = result.filter((row) => statusFilter.includes(row.status));
    }
    if (activityFilter.length > 0) {
      result = result.filter((row) =>
        activityFilter.includes(row.transferType)
      );
    }

    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      result = result.filter((row) => {
        const rowDate = new Date(row.date);
        return rowDate >= startDate && rowDate <= endDate;
      });
    }
    setFilteredData(result);
  }, [roleFilter, statusFilter, dateRange, activityFilter, tableDetails]);

  return (
    <>
      <div className="scrollbar-hide mx-auto flex min-h-screen flex-col">
        {/* .......Filters Section..... */}
        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/*......... Filter Dropdowns......... */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <FilterDropdown
              items={sort}
              title="Select sort option"
              placeholder="Sort by: All"
              onApply={handleRoleFilter}
              multiSelect={true}
            />

            <FilterDropdown
              items={status}
              title="Select status filter"
              placeholder="Status: All"
              onApply={handleStatusFilter}
              multiSelect={true}
            />

            <FilterDropdown
              items={payment}
              title="Select activity"
              placeholder="Activity: All"
              onApply={handleActivityFilter}
              multiSelect={true}
            />
          </div>

          {/* ......Date Picker.......... */}
          <div className="relative flex justify-start sm:justify-end">
            <DatePicker
              value={dateRange}
              onChange={(selectedDates) => setDateRange(selectedDates)}
              options={{
                mode: "range",
                dateFormat: "M d, Y",
                allowInput: true,
              }}
              placeholder="Select date range"
              className="w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-8 pr-3 text-xs font-normal text-black sm:w-[200px] sm:py-2.5 sm:pl-9 sm:text-sm md:w-[238px]"
            />
            <CalendarIcon className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-500 sm:left-3 sm:h-4 sm:w-4" />
          </div>
        </div>

        {/* ......Table Container....... */}
        <div className="overflow-x-hidden rounded-lg  bg-white shadow-sm">
          <table className="w-full min-w-[800px] divide-y divide-gray-200">
            <thead className="whitespace-nowrap border border-[#E2E2E2] bg-[#F6F6F7]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((headers) => (
                    <th
                      key={headers.id}
                      className="px-3 py-2 text-left text-[10px] font-medium tracking-wider text-gray-800 sm:px-4 sm:py-2.5 sm:text-xs md:px-6 md:py-3"
                    >
                      <div
                        {...{
                          className: headers.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "flex items-center",
                          onClick: headers.column.getToggleSortingHandler(),
                        }}
                      >
                        {/* <div className="text-center w-full"> */}
                        {flexRender(
                          headers.column.columnDef.header,
                          headers.getContext()
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {/* ....Table Body.......... */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-3 py-2 text-[#080808] sm:px-4 sm:py-2.5 md:px-5 md:py-3"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex w-full flex-col items-center justify-between gap-4 text-xs text-gray-700 sm:text-sm md:flex-row">
          {/*.........Page Navigation....... */}
          <div className="flex w-full items-center justify-between border-gray-200 pt-4">
            {/* ..Previous Button... */}
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex max-w-28 cursor-pointer items-center gap-2 rounded-lg bg-[#F6F6F7] px-4 py-2 text-[14px] font-normal text-[#050000] sm:text-sm"
            >
              <ArrowLeft size={15} />
              Previous
            </button>

            {/* ....Page Numbers..... */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: table.getPageCount() }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => table.setPageIndex(index)}
                  className={`rounded-full px-3 py-1.5 text-xs sm:text-sm ${
                    table.getState().pagination.pageIndex === index
                      ? "rounded-full bg-[#F6F6F7] text-[#050000]"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* ....Next Button...... */}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex max-w-28 cursor-pointer items-center gap-2 rounded-lg bg-[#F6F6F7] px-4 py-2 text-[14px] font-normal text-[#050000] sm:text-sm"
            >
              Next
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* ....Modal..... */}
        <Modal
          visible={isOpen}
          onClose={() => setIsOpen(false)}
          closeOnBackgroundClick={true}
          position="right"
          panelClassName="!max-w-full sm:!max-w-[600px] md:!max-w-[700px]"
        >
          <div className="scrollbar-hide flex h-full flex-col overflow-y-auto">
            <div className="p-4 sm:p-5 md:p-6">
              <OverviewModalContent
                onClose={() => setIsOpen(false)}
                expense={expenses}
              />{" "}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
