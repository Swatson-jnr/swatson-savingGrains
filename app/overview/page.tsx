"use client";

import Title from "../../components/title";
import OverviewCard from "./components/overview-cards";
import ActionCard from "../../components/action-card";
import Table from "../../components/table";
import { Button } from "../../components/ui/button";
import { formatDate } from "../../lib/utils";
import RecordTopUPModal from "./components/record-topup-modal";
import { AppLayout } from "../layout/app";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

// Images
import bill from "@/public/img/cash-payment-bill-1.svg";
import move from "@/public/img/move.svg";
import receive from "@/public/img/receive.svg";
import touch from "@/public/img/receive.svg";
import record from "@/public/img/streamline-ultimate-color_paper-write.svg";
import request from "@/public/img/moneyTransfer.png";
import Mag from "@/public/img/tag-dollar.svg";
import storehouse from "@/public/img/storehouse.svg";
import inventoryBox from "@/public/img/inventory_box.svg";
import overWallet from "@/public/img/over-wallet.svg";
import pouch from "@/public/img/pouch.svg";
import ionReceipt from "@/public/img/ion_receipt.svg";
import AuthGuard from "@/components/auth/auth-guard";
import RequestTopUpModal from "./components/request-topup-modal";
import Link from "next/link";
import RecordTransactionModal from "./components/record-topup-modal";
import PayServiceModal from "./components/pay-service-modal";
import MoveStockModal from "./components/move-stock-modal";
import ReceiveStockModal from "./components/receive-stock-modal";
import SellStockModal from "./components/sell-stock-modal";
import BuyStockModal from "./components/buy-stock-modal";
import apiClient from "@/lib/axios";

type ModalType =
  | "request-topup"
  | "record-transaction"
  | "pay-service"
  | "sell-stock"
  | "move-stock"
  | "buy-stock"
  | "receive-stock"
  | null;

type Props = {
  transactions: {
    id: number;
    amount: number;
    status: string;
    date: string;
  }[];
};

export default function OverviewPage({ transactions }: Props) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [allFarmers, setAllFarmers] = useState(null);
  const [allSellers, setAllSellers] = useState(null);
  const [warehouses, setWarehouses] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Convert "super-admin,field-agent" → ["super-admin", "field-agent"]
  const userRoles = user.roles ? user.roles.split(",") : [];

  // Role labels
  const ROLE_LABELS: Record<string, string> = {
    "super-admin": "Admin",
    admin: "Admin",
    "backoffice-admin": "Admin",
    "field-agent": "Field Agent",
    "stock-manager": "Stock Manager",
    paymaster: "Paymaster",
  };

  // Priority order (first match wins)
  const ROLE_PRIORITY = [
    "super-admin",
    "admin",
    "backoffice-admin",
    "field-agent",
    "stock-manager",
    "paymaster",
  ];

  let displayedRole = "User";

  for (const role of ROLE_PRIORITY) {
    if (userRoles.includes(role)) {
      displayedRole = ROLE_LABELS[role];
      break;
    }
  }

  // Overview cards
  const overviewCards = [
    { amount: "2,500 kg", icon: storehouse, type: "In Storehouse" },
    { amount: "1,200 kg", icon: inventoryBox, type: "Awaiting Pickup" },
    { amount: "₵200", icon: overWallet, type: "In Wallet" },
    { amount: "₵500", icon: pouch, type: "Spent on Grain" },
    { amount: "₵30", icon: ionReceipt, type: "Spent on Services" },
  ];

  // Action cards
  const actions = [
    {
      icon: Mag,
      label: "Buy Stock",
      bgColor: "#D19FFF4D",
      border: "#D19FFF",
      containerbgColor: "#D19FFF1D",
      modalType: "buy-stock" as ModalType,
    },
    {
      icon: touch,
      label: "Sell Stock",
      bgColor: "#9FEAFF4D",
      border: "#9FEAFF",
      containerbgColor: "#9FEAFF1D",
      modalType: "sell-stock" as ModalType,
    },
    {
      icon: bill,
      label: "Pay Service",
      border: "#FF9F9F",
      bgColor: "#FF9FAF4D",
      containerbgColor: "#FF9FAF1A",
      modalType: "pay-service" as ModalType,
    },
    {
      icon: move,
      label: "Move Stock",
      bgColor: "#B6FBDF4D",
      border: "#B6FBDF",
      containerbgColor: "#B6FBDF1A",
      modalType: "move-stock" as ModalType,
    },
    {
      icon: receive,
      label: "Receive Stock",
      bgColor: "#9FEAFF4D",
      border: "#9FEAFF",
      containerbgColor: "#9FEAFF1D",
      modalType: "receive-stock" as ModalType,
    },
    {
      icon: record,
      label: "Record Transaction",
      bgColor: "#FFDDA14D",
      border: "#FFDDA1",
      containerbgColor: "#FFDDA11A",
      modalType: "record-transaction" as ModalType,
    },
    {
      icon: request,
      label: "Request Top Up",
      bgColor: "#AED5814D",
      border: "#AED581",
      containerbgColor: "#AED5811A",
      modalType: "request-topup" as ModalType,
    },
  ];

  // Table data
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

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await apiClient.get("farmers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAllFarmers(res.data.farmers);
        console.log("Farmers:", res.data.farmers);
        return res.data;
      } catch (error) {
        console.error("Failed to load farmers:", error);
      }
    };
    const fetchSellers = async () => {
      try {
        const res = await apiClient.get("sellers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAllSellers(res.data.sellers);
        console.log("Sellers:", res.data.sellers);
        return res.data;
      } catch (error) {
        console.error("Failed to load sellers:", error);
      }
    };
    const fetchWarehouses = async () => {
      try {
        const res = await apiClient.get("warehouses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setWarehouses(res.data.data);
        console.log("Warehouses:", res.data.data);
        return res.data;
      } catch (error) {
        console.error("Failed to load sellers:", error);
      }
    };
    fetchWarehouses();
    fetchSellers();
    fetchFarmers();
  }, []);

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6 px-8 py-3">
          {/* Header */}
          <div>
            <Title text={`Welcome, ${displayedRole}!`} level={2} />
            <Title
              text="Here's an overview of your grain trading today."
              level={6}
              weight="normal"
            />
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {overviewCards.map((card, index) => (
              <OverviewCard
                key={index}
                amount={card.amount}
                icon={card.icon}
                type={card.type}
              />
            ))}
          </div>

          {/* Action Cards */}
          <div className="mb-4 rounded-[20px] border border-[#D6D8DA] px-5 py-5 w-70 md:w-full">
            <div className="mb-3">
              <Title text="Quick Actions" weight="semibold" level={6} />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {actions.map((action, index) => (
                <ActionCard
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  onClick={() => {
                    if (action.modalType) {
                      setActiveModal(action.modalType);
                    }
                  }}
                  bgColor={action.bgColor}
                  border={action.border}
                  containerbgColor={action.containerbgColor}
                />
              ))}
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <Title text="Recent Transactions" weight="semibold" level={5} />
              <Link href="/overview/transactions">
                <Button className="text-white cursor-pointer">View all</Button>
              </Link>
            </div>
            <Table tableDetails={tableData} />
          </div>
        </div>

        {/* Modals - Only one renders at a time */}
        <RequestTopUpModal
          visible={activeModal === "request-topup"}
          onClose={() => setActiveModal(null)}
        />

        <RecordTransactionModal
          visible={activeModal === "record-transaction"}
          onClose={() => setActiveModal(null)}
        />

        <BuyStockModal
          visible={activeModal === "buy-stock"}
          onClose={() => setActiveModal(null)}
          farmers={allFarmers}
          sellers={allSellers}
        />

        <PayServiceModal
          visible={activeModal === "pay-service"}
          onClose={() => setActiveModal(null)}
        />

        <MoveStockModal
          visible={activeModal === "move-stock"}
          onClose={() => setActiveModal(null)}
          warehouses={warehouses}
        />
        <ReceiveStockModal
          visible={activeModal === "receive-stock"}
          onClose={() => setActiveModal(null)}
        />
        <SellStockModal
          visible={activeModal === "sell-stock"}
          onClose={() => setActiveModal(null)}
        />
      </AppLayout>
    </AuthGuard>
  );
}
