"use client";

//....hooks/types...//
// import { useLocation } from "@/hooks/location";
import { LayoutProps } from "@/types";
// import { usePage, Link } from "@inertiajs/react";
import { AppLayout } from "./app";
import { useState } from "react";
import dayjs from "dayjs";

//....icons/images...//
import bill from "@/public/img/cash-payment-bill-1.svg";
import emptyWallet from "@/public/img/empty-wallet.svg";
import touch from "@/public/img/self-payment-touch.svg";
import record from "@/public/img/streamline-ultimate-color_paper-write.svg";
import request from "@/public/img/streamline-ultimate-color_paper-write.svg";
import Mag from "@/public/img/tag-dollar.svg";
import wallet2 from "@/public/img/wallet-2.svg";
import wallet from "@/public/img/wallet.svg";

//....components/utils...//
import { formatDate } from "@/lib/utils";
import Title from "@/components/title";
import PaymentCard from "@/components/payment-card";
import ActionCard from "@/components/action-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TransactionCard from "@/components/transaction-card";
import RecentTransactionCard from "@/components/recent-transaction-card";
import RequestTopUpModal from "../overview/components/request-topup-modal";
import RecordTopUPModal from "../overview/components/record-topup-modal";
import useLocation from "@/hooks/location";

// interface PageProps {
//   wallets?: any;
//   payments?: any;
// }

export function PaymentsLayout({ children }: LayoutProps) {
  // const { wallets } = (usePage().props as any) || {};
  const data = wallet;

  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const handleCardClick = (card: any) => {
    setSelectedCard(card);
    setOpenModal(true);
  };
  const location = useLocation();
  // const amount = "2500.00";
  // const table_detail = Array.isArray(data)
  // ? data.map((item: any) => ({});

  const recentTransaction = Array.isArray(data)
    ? data.map((item: any) => ({
        request: "Top up",
        id: item.id,
        paymentMethod:
          item.payment_method === "mobile_money"
            ? item.mobile_network
            : item.payment_method === "cash"
            ? "Cash"
            : item.bank_name || "N/A",
        amount: parseFloat(item.amount),
        status: item.status,
        reason: item.reason,
        role:
          item.user && item.user.roles?.length
            ? item.user.roles[0].name
            : "N/A",
        userId: item.user ? item.user.id : "N/A",
        requestedBy: item.user
          ? `${item.user.first_name} ${item.user.last_name}`
          : "Unknown User",
        date: formatDate(dayjs(item.created_at), "MMMM D, YYYY"),
        updatedAt: formatDate(dayjs(item.updated_at), "MMMM D, YYYY"),
        actions: "",
      }))
    : []; // ✅ safe fallback
  console.log("recentTransaction", recentTransaction);

  const transactions = recentTransaction;

  const rtransactions = [
    {
      id: 1,
      amount: "₵500",
      date: "May 1, 2025",
      person: "Nkrumah Adjei",
      success: true,
      icon: wallet,
      paymentType: "Mobile Money",
    },
    {
      id: 2,
      amount: "₵250",
      date: "May 3, 2025",
      person: "Sarah Mensah",
      success: false,
      icon: wallet,
      paymentType: "Mobile Money",
    },
    {
      id: 3,
      amount: "₵700",
      date: "May 5, 2025",
      person: "Kwame Owusu",
      success: true,
      icon: wallet,
      paymentType: "Mobile Money",
    },
    {
      id: 4,
      amount: "₵120",
      date: "May 7, 2025",
      person: "Ama Boateng",
      success: true,
      icon: wallet,
      paymentType: "Mobile Money",
    },
  ];

  const actions = [
    {
      icon: Mag,
      label: "Buy Stock",
    },
    {
      icon: touch,
      label: "Sell Stock",
      bgColor: "#9FEAFF4D",
      containerbgColor: "#9FEAFF1A",
    },
    {
      icon: touch,
      label: "Sell Stock",
      bgColor: "#9FEAFF4D",
      containerbgColor: "#9FEAFF1D",
    },
    {
      icon: bill,
      label: "Pay Service",
      bgColor: "#FF9F9F4D",
      containerbgColor: "#FF9F9F1A",
    },
    {
      icon: record,
      label: "Record Transaction",
      bgColor: "#FFDDA14D",
      containerbgColor: "#FFDDA11A",
    },
    {
      icon: request,
      label: "Request Top Up",
      bgColor: "#AED5814D",
      containerbgColor: "#AED5811A",
    },
  ];

  return (
    <>
      <AppLayout>
        <div className="container px-8">
          <div className="mb-5">
            <Title text="Payment" level={2} />{" "}
            <h4 className="text-[16px] font-normal">
              View and manage your payments
            </h4>
          </div>

          {/* .......Payment cards........... */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PaymentCard amount={"0.00"} icon={wallet} type="Cash Wallet" />
            <PaymentCard amount={"0.00"} icon={wallet2} type="App Wallet" />
            <PaymentCard
              amount={"0.00"}
              icon={emptyWallet}
              type="Total Auxiliary Funds"
            />
          </div>

          {/* ....Actions...... */}
          <div className="mb-4 rounded-[20px] border px-5 py-4">
            <div className="pb-2">
              <Title text="Action" level={6} weight="semibold" />
            </div>

            {/* ..............Action cards.......... */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* ..............Action cards.......... */}
              {actions.map((action, index) => (
                <ActionCard
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  onClick={() => handleCardClick(action)}
                  bgColor={action.bgColor}
                  containerbgColor={action.containerbgColor}
                />
              ))}
            </div>
          </div>

          {/* .....Request and Transactions.........*/}
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            {/* ........Fund Request section....... */}
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <Title text="Fund Requests" level={5} />
                <Link href="/fund-requests">
                  <Button className="bg-[#E7B00E]">View All</Button>
                </Link>
              </div>
              <div className="space-y-3 rounded-xl border border-[#D6D8DA] px-5 py-5">
                {transactions.slice(0, 4).map((txn: any) => (
                  <TransactionCard
                    key={txn.id}
                    amount={`₵${txn.amount}`}
                    date={txn.date}
                    person={txn.requestedBy}
                    success={txn.status}
                    icon={wallet}
                  />
                ))}
              </div>
            </div>

            {/* .....Recent Transactions section..... */}
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <Title text="Recent Transactions" level={5} />
                <Link href="/fund-requests">
                  <Button>View All</Button>
                </Link>
              </div>

              {/*......Recent Transaction card......*/}
              <div className="space-y-3 rounded-xl border border-[#D6D8DA] px-5 py-5">
                {rtransactions.map((txn) => (
                  <RecentTransactionCard
                    key={txn.id}
                    amount={txn.amount}
                    date={txn.date}
                    person={txn.person}
                    success={txn.success}
                    icon={txn.icon}
                    paymentType={txn.paymentType}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* <PaymentsList /> */}
        </div>
        {selectedCard?.label === "Request Top Up" && (
          <>
            <RequestTopUpModal
              visible={openModal}
              onClose={() => setOpenModal(false)}
            />
          </>
        )}
        {selectedCard?.label === "Record Transaction" && (
          <>
            <RecordTopUPModal
              visible={openModal}
              onClose={() => setOpenModal(false)}
            />
          </>
        )}
      </AppLayout>
    </>
  );
}
