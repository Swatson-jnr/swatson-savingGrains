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
import { useState } from "react";
import Title from "./title";
import OverviewModalContent from "@/app/overview/components/overview-modal-content";
import Modal from "./modal";

type tableData = {
  productLine: string;
  status: string;
  paymentMethod: string;
  amount: number;
  actions: string;
  date: string;
  quantity: string;
  unitPrice: string;
  role: string;
  agentName: string;
};

interface TableProps {
  tableDetails: tableData[];
}

export default function Table({ tableDetails }: TableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data] = useState(() => [...tableDetails]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGloablFilter] = useState("");
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const columnHelper = createColumnHelper<tableData>();

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
    columnHelper.accessor("date", {
      cell: (info) => (
        <span className="text-xs font-normal text-[#080808] sm:text-[13px] md:text-[14px]">
          {info.getValue()}
        </span>
      ),
      header: () => (
        <div className="flex justify-end mr-16">
          <Title text="Date" level={7} weight="normal" />
        </div>
      ),
    }),
    columnHelper.accessor("productLine", {
      cell: (info) => (
        <span className="text-xs font-normal text-[#080808] sm:text-[13px] md:text-[14px]">
          {info.getValue()}
        </span>
      ),
      header: () => <Title text="Product Line" level={7} weight="normal" />,
    }),
    columnHelper.accessor("agentName", {
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
      header: () => <Title text="Agent Name" level={7} weight="normal" />,
    }),
    columnHelper.accessor("role", {
      cell: (info) => (
        <span className="text-xs font-normal text-[#080808] sm:text-[13px] md:text-[14px]">
          {info.getValue()}
        </span>
      ),
      header: () => <Title text="Role" level={7} weight="normal" />,
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => (
        <span className="text-xs font-normal text-[#080808] sm:text-[13px] md:text-[14px]">
          {info.getValue()}
        </span>
      ),
      header: () => <Title text="Quantity" level={7} weight="normal" />,
    }),
    columnHelper.accessor("unitPrice", {
      cell: (info) => (
        <div className="flex items-center gap-2 text-[14px] font-normal">
          {" "}
          ₵{info.getValue()}
        </div>
      ),
      header: () => <Title text="Unit Price" level={7} weight="normal" />,
    }),

    columnHelper.accessor("amount", {
      cell: (info) => (
        <div className="flex items-center">
          <span className="text-sm font-normal text-[#E53F3F] sm:text-[16px] md:text-[14px]">
            ₵{info.getValue().toLocaleString()}
          </span>
        </div>
      ),
      header: () => <Title text="Amount" level={7} weight="normal" />,
    }),
    columnHelper.accessor("paymentMethod", {
      cell: (info) => (
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="rounded-full bg-[#F2F3F5] p-1.5 sm:p-2">
            <img
              src={
                info.getValue() === "Bank Transfer"
                  ? "../img/bank.svg"
                  : info.getValue() === "Mobile Money"
                  ? "../img/mobile.svg"
                  : "../img/cash.svg"
              }
              alt={info.getValue()}
              className="w-4 text-gray-500 sm:w-5"
            />
          </div>
          <span className="truncate text-xs font-normal text-black sm:text-[11px] md:text-[12px]">
            {info.getValue()}
          </span>
        </div>
      ),
      header: () => <Title text="Payment Method" level={7} weight="normal" />,
    }),
    columnHelper.accessor("actions", {
      cell: (info) => (
        <div className="flex items-center justify-center">
          <img
            src="../img/eye.svg"
            className="w-4 cursor-pointer text-gray-500 sm:w-3.5 md:w-4"
            onClick={() => setIsOpen(true)}
            alt="View details"
          />
        </div>
      ),
      header: () => <Title text="Actions" level={7} weight="normal" />,
      meta: {
        className: "sticky right-0 bg-white z-10 w-[80px]", // 👈 add this
      },
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
    { id: "gh", name: "Admin" },
    { id: "de", name: "Paymasters" },
    { id: "es", name: "Field Agents" },
  ];
  const status = [
    { id: "gh", name: "Pending" },
    { id: "de", name: "Approved" },
    { id: "es", name: "Denied" },
    { id: "es", name: "Successful" },
    { id: "es", name: "Failed" },
  ];
  const payment = [
    { id: "gh", name: "Cash Payment" },
    { id: "de", name: "Mobile Money" },
    { id: "es", name: "Bank Transfer" },
  ];
  const handleCountryApply = (selectedIds: string[]) => {
    console.log("Selected countries:", selectedIds);
  };

  return (
    <>
      <div className="scrollbar-hide mx-auto flex min-h-screen flex-col">
        {/* ......Table Container....... */}
        <div className="overflow-x-hidden rounded-lg border bg-white shadow-sm">
          <table className="w-full min-w-[800px] divide-y divide-gray-200">
            <thead className="whitespace-nowrap border border-[#E2E2E2] bg-[#F6F6F7]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((headers) => (
                    <th
                      key={headers.id}
                      className="w-10 py-3 pr-4 text-center text-[14px] font-normal tracking-wider text-gray-800"
                    >
                      <div
                        {...{
                          className: headers.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center justify-center"
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
            <tbody className="divide-y divide-gray-200 border bg-white text-center">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-2 py-2 text-[#080808] md:py-3"
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
              />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
