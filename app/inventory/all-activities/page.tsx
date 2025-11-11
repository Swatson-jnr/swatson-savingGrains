// import { Link } from "@inertiajs/react";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import FullTable from "../../../components/full-table";
import Title from "../../../components/title";
// import { AppLayout } from "../../layouts/app";
import { formatDate } from "../../../lib/utils";
import InventoryTable from "../components/inventory-table";
import { AppLayout } from "../../layout/app";
import Link from "next/link";

const AllActivities = () => {
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
      transferType: "Receive",
      status: "failed",
      weight: "300 kg",
      grainType: "Yellow Corn",
      date: formatDate(dayjs().subtract(1, "week"), "MMMM D, YYYY"),
      role: "Field Agent",
      initiatedBy: "Kwame Asante",
    },
    {
      transferType: "Receive",
      status: "failed",
      weight: "300 kg",
      grainType: "Yellow Corn",
      date: formatDate(dayjs().subtract(1, "week"), "MMMM D, YYYY"),
      role: "Field Agent",
      initiatedBy: "Kwame Asante",
    },
    {
      transferType: "Transfer",
      status: "failed",
      weight: "300 kg",
      grainType: "Yellow Corn",
      date: formatDate(dayjs().subtract(1, "week"), "MMMM D, YYYY"),
      role: "Field Agent",
      initiatedBy: "Kwame Asante",
    },
    {
      transferType: "Transfer",
      status: "failed",
      weight: "300 kg",
      grainType: "Yellow Corn",
      date: formatDate(dayjs().subtract(1, "week"), "MMMM D, YYYY"),
      role: "Field Agent",
      initiatedBy: "Kwame Asante",
    },
    {
      transferType: "Receive",
      status: "failed",
      weight: "300 kg",
      grainType: "Yellow Corn",
      date: formatDate(dayjs().subtract(1, "week"), "MMMM D, YYYY"),
      role: "Field Agent",
      initiatedBy: "Kwame Asante",
    },
  ];

  return (
    <>
      <AppLayout>
        <div className="scrollbar-hide ml-7 mt-3">
          <Link href="/inventory" className="flex items-center gap-2">
            <ArrowLeft />
            <h4>Back</h4>
          </Link>
          <Title text="All Activities" level={4} />
          <InventoryTable tableDetails={tableData} />
        </div>
      </AppLayout>
    </>
  );
};

export default AllActivities;
