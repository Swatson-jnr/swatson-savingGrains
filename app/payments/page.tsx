"use client";

// .......Hooks/Types...... //
import useLocation from "@/hooks/location";
import { LayoutProps } from "@/types";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

// .......Icons/Images...... //
import bill from "@/public/img/cash-payment-bill-1.svg";
import emptyWallet from "@/public/img/empty-wallet.svg";
import touch from "@/public/img/self-payment-touch.svg";
import record from "@/public/img/streamline-ultimate-color_paper-write.svg";
import request from "@/public/img/moneyTransfer.png";
import Mag from "@/public/img/tag-dollar.svg";
import wallet2 from "@/public/img/wallet-2.svg";
import wallet from "@/public/img/wallet.svg";

// .......Components/Utils...... //
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
import { AppLayout } from "../layout/app";
import axios from "axios";
import apiClient from "@/lib/axios";

interface PageProps {
  wallets?: any;
  payments?: any;
}

export default function PaymentsLayout({ children }: LayoutProps) {
  // const wallets = { data: [] };
  // const data = wallets.data || [];

  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<any>(null);
  const [cashBalance, setcCashBalance] = useState<any>(null);
  const [appBalance, setAppBalance] = useState<any>(null);
  // const [appBalance, setAppBalance] = useState<any>(null);
  const [walletBackend, setWalletBackend] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const handleCardClick = (card: any) => {
    setSelectedCard(card);
    setOpenModal(true);
  };
  // const location = useLocation();
  // const amount = "2500.00";

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCard(null); // Clear the selected card
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await apiClient.get("/wallet-topup-request", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        // console.log("Payments data:", response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching payments data:", error);
      }
    };

    fetchRequest();
  }, []);

  useEffect(() => {
    const fetchWallet = async () => {
      const token = localStorage.getItem("access_token");
      // console.log("Token being sent:", token);

      try {
        const response = await apiClient.get("wallets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log("Wallet card data:", response);
        setWalletBackend(response.data);
      } catch (error: any) {
        console.error(
          "Error fetching payments data:",
          error.response?.data || error.message
        );
      }
    };
    fetchWallet();
  }, []);

  useEffect(() => {
    if (!walletBackend) return;

    // Assuming walletBackend is an array of wallet objects
    const cashWallet = walletBackend.find((w: any) => w.type === "cash");
    const appWallet = walletBackend.find((w: any) => w.type === "app");

    setcCashBalance(cashWallet ? cashWallet.balance : 0);
    setAppBalance(appWallet ? appWallet.balance : 0);

    // console.log("Cash Wallet Balance:", cashWallet?.balance || 0);
    // console.log("App Wallet Balance:", appWallet?.balance || 0);
  }, [walletBackend]);

  const recentTransaction = Array.isArray(data)
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
            <h4 className="text-[16px] font-normal text-black">
              View and manage your payments
            </h4>
          </div>

          {/* .......Payment cards........... */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PaymentCard
              amount={cashBalance ? `${cashBalance}.00` : "0.00"}
              icon={wallet}
              type="Cash Wallet"
            />
            <PaymentCard
              amount={appBalance ? `${appBalance}.00` : "0.00"}
              icon={wallet2}
              type="App Wallet"
            />
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
            {/* <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <Title text="Fund Requests" level={5} />
                <Link href="/payments/fund-requests">
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
                    icon="/img/wallet.svg"
                  />
                ))}
              </div>
            </div> */}
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <Title text="Fund Requests" level={5} />
                <Link href="/payments/fund-requests">
                  <Button className="bg-[#E7B00E]">View All</Button>
                </Link>
              </div>
              <div className="space-y-3 rounded-xl border border-[#D6D8DA] px-5 py-5">
                {transactions.length === 0 ? (
                  <TransactionCard isEmpty={true} />
                ) : (
                  transactions
                    .slice(0, 4)
                    .map((txn: any) => (
                      <TransactionCard
                        key={txn.id}
                        amount={`₵${txn.amount}`}
                        date={txn.date}
                        person={txn.requestedBy}
                        success={txn.status}
                        icon="/img/wallet.svg"
                      />
                    ))
                )}
              </div>
            </div>

            {/* .....Recent Transactions section..... */}
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <Title text="Recent Transactions" level={5} />
                <Link href="/overview/transactions">
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
                    icon="../img/wallet.svg"
                    paymentType={txn.paymentType}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {selectedCard?.label === "Request Top Up" && (
          <>
            <RequestTopUpModal visible={openModal} onClose={handleCloseModal} />
          </>
        )}
        {selectedCard?.label === "Record Transaction" && (
          <>
            <RecordTopUPModal visible={openModal} onClose={handleCloseModal} />
          </>
        )}
      </AppLayout>
    </>
  );
}
