// import { Link } from "@inertiajs/react";
import { AppLayout } from "@/app/layout/app";
import Title from "@/components/title";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PickupTable from "../components/pickup-table";
import { formatDate } from "@/lib/utils";
// import Title from "../../components/title";
// import { AppLayout } from "../../layouts/app";
// import { formatDate } from "../../lib/utils";
// import PickupTable from "./components/pickup-table";

const PendingPickups = () => {
  const table_detail = [
    {
      request: "Top up",
      paymentMethod: "Cash",
      amount: 34566,
      status: "pending",
      requestedBy: "Alfred Dzidonu",
      date: "May 7, 2025",
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
      initiatedBy: "Alfred Dzidonu",
    },
    {
      transferType: "Receive",
      status: "failed",
      weight: "300 kg",
      grainType: "Yellow Corn",
      date: formatDate(dayjs().subtract(1, "week"), "MMMM D, YYYY"),
      role: "Field Agent",
      initiatedBy: "Sarah Mensah",
    },
    {
      transferType: "Receive",
      status: "failed",
      weight: "300 kg",
      grainType: "Yellow Corn",
      date: formatDate(dayjs().subtract(1, "week"), "MMMM D, YYYY"),
      role: "Field Agent",
      initiatedBy: "Kwame Owusu",
    },
    {
      transferType: "Receive",
      status: "failed",
      weight: "300 kg",
      grainType: "Yellow Corn",
      date: formatDate(dayjs().subtract(1, "week"), "MMMM D, YYYY"),
      role: "Field Agent",
      initiatedBy: "Kwame Owusu",
    },
    {
      transferType: "Receive",
      status: "failed",
      weight: "300 kg",
      grainType: "Yellow Corn",
      date: formatDate(dayjs().subtract(1, "week"), "MMMM D, YYYY"),
      role: "Field Agent",
      initiatedBy: "Ato Sey",
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
          <Title text="Pending Pickups" level={4} />
          <PickupTable tableDetails={tableData} />
        </div>
      </AppLayout>
    </>
  );
};

export default PendingPickups;
