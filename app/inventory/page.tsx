// import { Link } from "@inertiajs/react";
import Link from "next/link";
import building from "@/public/img/building.svg";
import move from "@/public/img/move.svg";
import receive from "@/public/img/receive.svg";
import Mag from "@/public/img/tag-dollar.svg";
import ActionCard from "../../components/action-card";
import Title from "../../components/title";
import { Button } from "../../components/ui/button";
import { AppLayout } from "../layout/app";
// import { AppLayout } from "../../layouts/app";
import InventoryCard from "./components/inventory-cards";
import PendingPickupCard from "./components/pending-pickup-card";
import RecentActivityCard from "./components/recent-activity";
import AuthGuard from "@/components/auth/auth-guard";

const index = () => {
  const overviewCards = [
    {
      amount: "850 kg",
      icon: "../img/fbox.svg",
      type: "Total Weight",
    },
    {
      amount: "50 kg",
      icon: "../img/inv_Box.svg",
      type: "Weight Of Dry Goods",
    },
    {
      amount: "76 kg",
      icon: "../img/inv_Box.svg",
      type: "Weight Of Wet Goods",
    },
    {
      amount: "93 kg",
      icon: "../img/inv_Box.svg",
      type: "Weight Of Refined Goods",
    },
    {
      amount: "43 kg",
      icon: "../img/inv_Box.svg",
      type: "Weight Of Unrefined Goods",
    },
  ];

  const actions = [
    {
      icon: Mag,
      label: "Buy Stock",
      bgColor: "#D19FFF4D",
      containerbgColor: "#D19FFF1D",
    },
    {
      icon: move,
      label: "Move Stock",
      bgColor: "#B6FBDF4D",
      containerbgColor: "#B6FBDF1A",
    },
    {
      icon: receive,
      label: "Receive Stock",
      bgColor: "#9FEAFF4D",
      containerbgColor: "#9FEAFF1A",
    },
  ];

  const transactions = [
    {
      id: 1,
      amount: "500 kg",
      from: "Field Agent",
      activity: "Transfer",
      date: "May 7, 2025",
      person: "Alfred Dzidonu",
      success: "Failed",
      icon: building,
      grainType: "Yellow Maize",
      paymentType: "Mobile Money",
    },
    {
      id: 4,
      amount: "500 kg",
      from: "Warehouse A",
      activity: "Receive",
      date: "May 7, 2025",
      person: "COP Co. Ltd",
      success: "Successful",
      icon: building,
      grainType: "White Maize",
      paymentType: "Mobile Money",
    },
    {
      id: 2,
      amount: "500 kg",
      from: "Field Agent",
      activity: "Transfer",
      date: "May 7, 2025",
      person: "Sarah Mensah",
      success: "Failed",
      icon: building,
      grainType: "Yellow Maize",
      paymentType: "Mobile Money",
    },
    {
      id: 3,
      amount: "500 kg",
      from: "Field Agent",
      activity: "Transfer",
      date: "May 7, 2025",
      person: "Kwame Owusu",
      success: "Failed",
      icon: building,
      grainType: "Yellow Maize",
      paymentType: "Mobile Money",
    },
  ];

  return (
    <>
      <AuthGuard>
        <AppLayout>
          <div className="space-y-6 px-8 py-3">
            <div>
              <Title text="Inventory" level={2} />
              <Title
                text="View and manage your inventory"
                level={6}
                weight="normal"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {overviewCards.map((card, index) => (
                <InventoryCard
                  key={index}
                  amount={card.amount}
                  icon={card.icon}
                  type={card.type}
                />
              ))}
            </div>
            <div className="mb-4 rounded-[20px] border px-5 py-5">
              <div className="mb-3">
                <Title text="Quick Actions" weight="semibold" level={6} />
              </div>
              {/* ..............Action cards.......... */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {actions.map((action, index) => (
                  <ActionCard
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    bgColor={action.bgColor}
                    containerbgColor={action.containerbgColor}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-6 md:flex-row">
              {/* ........Fund Request section....... */}
              <div className="flex-1">
                <div className="mb-3 flex items-center justify-between">
                  <Title text="Pending Pickups" level={5} />
                  <Link href="/inventory/pending-pickups">
                    <Button className="bg-[#E7B00E]">View All</Button>
                  </Link>
                </div>
                <div className="space-y-3 rounded-[12px] border border-[#D6D8DA] px-5 py-5">
                  {transactions.map((txn) => (
                    <PendingPickupCard
                      key={txn.id}
                      amount={txn.amount}
                      from={txn.from}
                      date={txn.date}
                      person={txn.person}
                      success={txn.success}
                      icon={txn.icon}
                      grainType={txn.grainType}
                    />
                  ))}
                </div>
              </div>

              {/* .....Recent Transactions section..... */}
              <div className="flex-1">
                <div className="mb-3 flex items-center justify-between">
                  <Title text="Recent Activities" level={5} />
                  <Link href="/inventory/recent-activities">
                    <Button>View All</Button>
                  </Link>
                </div>

                {/*......Recent Transaction card......*/}
                <div className="space-y-3 rounded-[12px] border border-[#D6D8DA] px-5 py-5">
                  {transactions.map((txn) => (
                    <RecentActivityCard
                      key={txn.id}
                      amount={txn.amount}
                      activity={txn.activity}
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
          </div>
        </AppLayout>
      </AuthGuard>
    </>
  );
};

export default index;
