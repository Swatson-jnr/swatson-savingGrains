import { AppLayout } from "@/app/layout/app";
import FullTable from "@/components/full-table";
import Title from "@/components/title";
import { formatDate } from "@/lib/utils";
import dayjs from "dayjs";
// import { Dayjs } from "dayjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


const transactions = () => {
  const table_detail = [
    {
      request: "Top up",
      paymentMethod: "Cash",
      amount: 34566,
      status: "pending",
      requestedBy: "John Doe",
      date: "27/09/2025",
      actions: " ",
    },
    {
      request: "Top up",
      paymentMethod: "Mobile Money",
      amount: 34566,
      status: "pending",
      requestedBy: "John Doe",
      date: "27/09/2025",
      actions: " ",
    },
    {
      request: "Top up",
      paymentMethod: "Bank Transfer",
      amount: 34566,
      status: "pending",
      requestedBy: "John Doe",
      date: "27/09/2025",
      actions: " ",
    },
    {
      request: "Top up",
      paymentMethod: "Mobile Money",
      amount: 34566,
      status: "pending",
      requestedBy: "John Doe",
      date: "27/09/2025",
      actions: " ",
    },
    {
      request: "Top up",
      paymentMethod: "Bank Transfer",
      amount: 34566,
      status: "pending",
      requestedBy: "John Doe",
      date: "27/09/2025",
      actions: " ",
    },
  ];

  const tableData = [
    {
      productLine: "Cashew",
      status: "Completed",
      paymentMethod: "Mobile Money",
      amount: 1200,
      actions: "View",
      date: formatDate(dayjs().subtract(2, "day"), "MMMM D, YYYY"),
      quantity: "5",
      unitPrice: "240",
      role: "Field Agent",
      agentName: "Jennifer Offin",
    },
    {
      productLine: "Maize",
      status: "Pending",
      paymentMethod: "Cash",
      amount: 800,
      actions: "Retry",
      date: formatDate(dayjs().subtract(5, "day"), "MMMM D, YYYY"),
      quantity: "2",
      unitPrice: "400",
      role: "Admin",
      agentName: "John Mensah",
    },
    {
      productLine: "Maize",
      status: "Failed",
      paymentMethod: "Bank Transfer",
      amount: 450,
      actions: "Resolve",
      date: formatDate(dayjs().subtract(10, "day"), "MMMM D, YYYY"),
      quantity: "1",
      unitPrice: "450",
      role: "Paymaster",
      agentName: "Ama Serwaa",
    },
    {
      productLine: "Trucks",
      status: "Completed",
      paymentMethod: "Cash",
      amount: 3000,
      actions: "View",
      date: formatDate(dayjs().subtract(1, "week"), "MMMM D, YYYY"),
      quantity: "10",
      unitPrice: "300",
      role: "Field Agent",
      agentName: "Kwame Asante",
    },
    {
      productLine: "General",
      status: "Processing",
      paymentMethod: "Mobile Money",
      amount: 950,
      actions: "Track",
      date: formatDate(dayjs(), "MMMM D, YYYY"),
      quantity: "3",
      unitPrice: "316.67",
      role: "Admin",
      agentName: "Akua Baah",
    },
  ];

  return (
    <>
      <AppLayout>
        <div className="scrollbar-hide ml-7 mt-3">
          <Link href="/overview" className="flex text-black items-center gap-2">
            <ArrowLeft />
            <h4>Back</h4>
          </Link>
          <Title text="Transactions" level={4} />
          <FullTable tableDetails={tableData} />
        </div>
      </AppLayout>
    </>
  );
};

export default transactions;
