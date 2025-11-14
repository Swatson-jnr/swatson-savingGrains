"use client";

import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";

import { formatDate } from "../../../lib/utils";
import FundTable from "./components/fund-table";
import { AppLayout } from "@/app/layout/app";
import Link from "next/link";
import Title from "@/components/title";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import apiClient from "@/lib/axios";

export default function Index() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/wallet-topup-request", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setData(response.data.data);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const table_detail = Array.isArray(data)
    ? data.map((item: any) => ({
        request: item.label || "Top up",
        id: item.id,
        paymentMethod: item.paymentType || "None Selected",
        amount: parseFloat(item.amount) || 0,
        currency: item.currency || "GHS",
        status: item.status || "unknown",
        role: item.roles ? item.roles.join(", ") : "N/A",
        reason: item.reason || "No reason provided",
        userId: item.user || "N/A",
        requestedBy: item.requesterName || "Unknown User",
        date: formatDate(dayjs(item.requestedDate), "MMMM D, YYYY"),
        actions: "",
      }))
    : [];

  return (
    <>
      <AuthGuard>
        <AppLayout>
          <div className="scrollbar-hide ml-7 mt-3">
            {/* ....navigation.... */}
            <Link href="/payments" className="inline-flex items-center gap-2">
              <ArrowLeft color="black" />
              <h4 className="text-black">Back</h4>
            </Link>
            <Title text="Fund Request" level={2} />
            <FundTable fundDetails={table_detail} />
          </div>
        </AppLayout>
      </AuthGuard>
    </>
  );
}
