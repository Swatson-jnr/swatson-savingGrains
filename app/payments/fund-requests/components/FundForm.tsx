import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LayoutProps } from "@/types";
import Link from "next/link";

const FundForm = ({ children }: LayoutProps) => {
  return (
    <div className="container px-8">
      <h4 className="text-[30px] font-bold text-[#080808]">Payments</h4>
      <h4 className="text-[16px] font-semibold">
        View and manage your payments
      </h4>
      <div>
        <ul className="flex flex-wrap text-center text-sm font-medium text-gray-500">
          <li className="me-2">
            <Link
              href={route("web.payments.grain-purchases.index")}
              className={cn("tabs-nav-item", {
                active: location.pathname.includes("grain-purchases"),
              })}
            >
              Grain purchases
            </Link>
          </li>
          <li>
            <Link
              href={route("web.payments.expenses.index")}
              className={cn("tabs-nav-item", {
                active: location.pathname.includes("expenses"),
              })}
            >
              Expenses
            </Link>
          </li>
        </ul>

        <Card className="rounded-0 p-4">
          <section>{children}</section>
        </Card>
      </div>
    </div>
  );
};

export default FundForm;
