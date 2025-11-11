import useLocation from "@/hooks/location";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo } from "react";

export function SettingsHeader() {
  const location = useLocation();

  const activeTab = useMemo(() => {
    if (location.pathname?.includes("/settings/users")) {
      return "users";
    }
    if (location.pathname?.includes("/settings/roles")) {
      return "roles";
    }
    if (location.pathname?.includes("/settings/verification-codes")) {
      return "verifications";
    }
    if (location.pathname?.includes("/settings/delivery-companies")) {
      return "deliveries";
    }
    if (location.pathname?.includes("/settings/warehouses")) {
      return "warehouses";
    }
    if (location.pathname?.includes("/settings/aggregators")) {
      return "aggregators";
    }
    if (location.pathname?.includes("/settings/configs")) {
      return "configs";
    }
    return "";
  }, [location]);

  return (
    <>
      <ul className="flex flex-wrap text-center text-sm font-medium text-gray-500">
        <li className="me-2">
          <Link
            href={route("web.settings.users.index")}
            className={cn("tabs-nav-item", {
              active: activeTab === "users",
            })}
          >
            Users
          </Link>
        </li>
        {/* <li className="me-2">
          <Link
            href={route("web.settings.roles.index")}
            className={cn("tabs-nav-item", {
              active: activeTab === "roles",
            })}
          >
            Roles
          </Link>
        </li> */}
        <li className="me-2">
          <Link
            href={route("web.settings.verification-codes")}
            className={cn("tabs-nav-item", {
              active: activeTab === "verifications",
            })}
          >
            Verification Codes
          </Link>
        </li>
        {/* <li className="me-2">
          <Link
            href={route("web.settings.delivery-companies.index")}
            className={cn("tabs-nav-item", {
              active: activeTab === "deliveries",
            })}
          >
            Delivery Companies
          </Link>
        </li>
        <li className="me-2">
          <Link
            href={route("web.settings.aggregators.index")}
            className={cn("tabs-nav-item", {
              active: activeTab === "aggregators",
            })}
          >
            Aggregators
          </Link>
        </li>
         */}
        <li>
          <Link
            href={route("web.settings.warehouses.index")}
            className={cn("tabs-nav-item", {
              active: activeTab === "warehouses",
            })}
          >
            Warehouses
          </Link>
        </li>
        <li>
          <Link
            href={route("web.settings.configs.index")}
            className={cn("tabs-nav-item", {
              active: activeTab === "configs",
            })}
          >
            Configuration
          </Link>
        </li>
      </ul>
    </>
  );
}
