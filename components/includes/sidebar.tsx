"use client";

import useLocation from "@/hooks/location";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type NavLink = {
  href: string;
  label: string;
  icon: string;
  isImage?: boolean;
  activeKey: string;
  roles: string[];
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // prevents early return

  // ---- Load user from localStorage safely ----
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      setUser(storedUser);
      setUserRoles(storedUser?.roles?.split(",") || []);
      setIsLoaded(true);
    }
  }, []);

  // ---- Logout handler ----
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");

      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie =
          name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
    }
    router.push("/login");
  };

  // ---- Nav links ----
  const navLinks: NavLink[] = [
    {
      href: "/overview",
      label: "Overview",
      icon: "../img/home.svg",
      activeKey: "overview",
      roles: [
        "super-admin",
        "field-agent",
        "backoffice-admin",
        "stock-manager",
      ],
    },
    {
      href: "/inventory",
      label: "Inventory",
      icon: "../img/box.svg",
      activeKey: "inventory",
      roles: ["super-admin", "stock-manager", "field-agent"],
    },
    {
      href: "/payments",
      label: "Payments",
      icon: "../img/wallet2.svg",
      activeKey: "payments",
      roles: ["super-admin", "paymaster", "field-agent"],
    },
    {
      href: "/sales",
      label: "Sales",
      icon: "../img/chart.svg",
      activeKey: "sales",
      roles: ["super-admin", "backoffice-admin"],
    },
    {
      href: "/user-management",
      label: "User Management",
      icon: "../img/people.svg",
      activeKey: "users",
      roles: ["super-admin", "backoffice-admin"],
    },
    {
      href: "/products",
      label: "Product Management",
      icon: "../img/project.svg",
      activeKey: "products",
      roles: ["super-admin", "stock-manager"],
    },
    {
      href: "/reports",
      label: "Reports",
      icon: "../img/linear.svg",
      activeKey: "reports",
      roles: ["super-admin", "backoffice-admin"],
    },
  ];

  // ---- Filter links by user roles ----
  const filteredLinks = useMemo(() => {
    return navLinks.filter((link) =>
      link.roles.some((role) => userRoles.includes(role))
    );
  }, [userRoles]);

  // ---- Active tab ----
  const activeTab = useMemo(() => {
    const pathname = location.pathname ?? "";
    if (pathname.includes("/overview")) return "overview";
    if (pathname.includes("/inventory")) return "inventory";
    if (pathname.includes("/payments")) return "payments";
    if (pathname.includes("/reports")) return "reports";
    if (pathname.includes("/products")) return "products";
    if (pathname.includes("/sales")) return "sales";
    if (pathname.includes("/user-management")) return "users";
    if (pathname.includes("/settings")) return "settings";
    return "";
  }, [location.pathname]);

  // ---- Render placeholder while loading ----
  if (!isLoaded) {
    return (
      <nav className="fixed left-0 top-16 w-16 h-[calc(100vh-4rem)] bg-white border-r" />
    );
  }

  return (
    <>
      {/* Sidebar toggle */}
      <button
        className="fixed z-50 cursor-pointer transition-all duration-300"
        style={{
          left: isOpen ? "225px" : "40px",
          top: isOpen ? "98px" : "80px",
          width: isOpen ? "48px" : "40px",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={"../img/sidebar_toggle_button.svg"} alt="sidebar_toggler" />
      </button>

      {/* Sidebar */}
      <nav
        className={cn(
          "fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] origin-left transform overflow-y-auto border-r border-[#D6D8DA] bg-white transition-all duration-300",
          isOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-full flex-col justify-between">
          {/* Navigation links */}
          <div
            className={cn(
              "flex flex-col gap-1 pt-8 transition-all duration-300",
              isOpen ? "mr-6 px-4" : "px-2"
            )}
          >
            {filteredLinks.map((link) => (
              <Link
                key={link.activeKey}
                href={link.href}
                className={cn(
                  "flex items-center gap-1 rounded-lg transition-colors hover:bg-gray-100",
                  isOpen ? "h-[50px] py-2.5 pl-1" : "h-12 justify-center py-3",
                  {
                    "bg-[#E7B00E1A]": activeTab === link.activeKey,
                  }
                )}
                title={!isOpen ? link.label : undefined}
              >
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-md",
                    isOpen ? "h-9 w-9" : "h-8 w-8"
                  )}
                >
                  <img
                    src={link.icon as string}
                    alt={link.label}
                    className="h-[22px] w-[22px] object-contain"
                  />
                </div>

                {isOpen && (
                  <span className="whitespace-nowrap text-[16px] font-normal text-[#080808]">
                    {link.label}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Logout button */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-2 rounded-md py-2 text-[#080808] transition hover:bg-gray-100",
                isOpen ? "justify-center" : "justify-center"
              )}
              title={!isOpen ? "Logout" : undefined}
            >
              <LogOutIcon size={20} />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
