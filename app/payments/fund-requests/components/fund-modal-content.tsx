"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import AgentInfoCard from "./agent-info-card";
import FundRequestDetails from "./request-detail-card";
import SectionHeading from "./section-heading";
import Status from "./status-card";
import WalletBalanceCard from "./wallet-balance-card";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import axios from "axios";
import apiClient from "@/lib/axios";
import { getUserRolesById } from "@/lib/userRole";
import SelectInput from "@/app/overview/components/select-input";

interface WalletBackend {
  id: string | number;
  actions: "";
  amount: string;
  date: string;
  paymentMethod: string;
  request: string;
  requestedBy: string;
  status: string;
  role: string;
  reason: string;
  userId: string;
  updatedAt: string;
  provider?: string;
  phone_number?: string;
  bank_name?: string;
  branch_name?: string;
  account_number?: string;
  mobile_number?: string;
  mobile_network?: string;
}

interface FundModalContentProps {
  onClose: () => void;
  wallet: WalletBackend;
  onSuccess?: () => void;
  userRole?: string;
}

const getUserRole = (): string | null => {
  if (typeof window === "undefined") return null;

  const roleFromStorage = localStorage.getItem("userRole");
  if (roleFromStorage) return roleFromStorage;

  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.roles || null;
    } catch {
      return null;
    }
  }

  return null;
};

const FundModalContent = ({
  onClose,
  wallet,
  onSuccess,
  userRole,
}: FundModalContentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [walletBackend, setWalletBackend] = useState<any>(null);
  const [cashBalance, setcCashBalance] = useState<number>(0);
  const [appBalance, setAppBalance] = useState<number>(0);
  const [roles, setRoles] = useState<any>([]);
  // const { toast } = useToast();

  const effectiveUserRole = userRole || getUserRole();
  const canApproveDecline =
    effectiveUserRole?.toLowerCase().includes("admin") ||
    effectiveUserRole?.toLowerCase().includes("paymaster");

  const handleUpdateStatus = async (status: "approved" | "declined") => {
    console.log("=== handleUpdateStatus called ===");
    console.log("Status:", status);
    console.log("Wallet data:", wallet);


    if (isProcessing) {
      console.log("Already processing, returning");
      return;
    }

    if (!canApproveDecline) {
      console.log("User not authorized");
      // toast({
      //   title: "Unauthorized",
      //   description: "Only admin or paymaster can approve/decline requests",
      //   variant: "destructive",
      // });
      toast.error("Only admin or paymaster can approve/decline requests");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      setErrors({ general: "Payment method is required" });
      setIsProcessing(false);
      return;
    }
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("access_token");
      const requestBody: Record<string, unknown> = { status };

      // For approval, just send the status
      // The backend should have all the payment details already
      if (status === "approved") {
        console.log("Processing approval...");
        requestBody.payment_method = paymentMethod;
      }

      console.log("Request body:", requestBody);
      console.log("Making API call to approve/decline...");

      const response = await apiClient.put(
        `wallet-topup-request/${wallet.id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      if (!response.data) {
        throw new Error(
          response.data?.error || "Failed to update wallet request"
        );
      }

      // toast({
      //   title: "Success",
      // description: `Wallet request ${
      //   status === "approved" ? "approved" : "declined"
      // } successfully`,
      // });
      toast.success(
        `Wallet request ${
          status === "approved" ? "approved" : "declined"
        } successfully`
      );

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error in handleUpdateStatus:", error);

      // Enhanced error logging
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);

        // Show specific error message from backend if available
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update wallet request";

        toast.error(errorMessage);
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update wallet request"
        );
      }
    } finally {
      console.log("Setting isProcessing to false");
      setIsProcessing(false);
    }
  };


  const handleApprove = () => {
    console.log("Approve button clicked");
    handleUpdateStatus("approved");
  };

  const handleDecline = () => {
    console.log("Decline button clicked");
    handleUpdateStatus("declined");
  };

  const handleCancel = () => onClose();

  const amountRequested = parseFloat(wallet.amount);
  const capitalizeFirst = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get("users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        console.log("User details:", response.data);
        setWalletBalance(response.data);
      } catch (error) {
        console.error("Error fetching payments data:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await apiClient.get("wallets", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        console.log("Wallet data:", response);
        setWalletBackend(response.data);
      } catch (error) {
        console.error("Error fetching payments data:", error);
      }
    };

    fetchWallet();
  }, [cashBalance, appBalance]);

  useEffect(() => {
    if (!walletBackend) return;

    // Assuming walletBackend is an array of wallet objects
    const cashWallet = walletBackend.find((w: any) => w.type === "cash");
    const appWallet = walletBackend.find((w: any) => w.type === "app");

    setcCashBalance(cashWallet ? cashWallet.balance : 0);
    setAppBalance(appWallet ? appWallet.balance : 0);
  }, [walletBackend]);

  // Debug: Log wallet data on mount
  useEffect(() => {
    console.log("=== Wallet prop received ===");
    console.log(wallet);
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      const userRoles = await getUserRolesById(wallet.userId);
      setRoles(userRoles);
      console.log("Fetched user roles:", userRoles);
      console.log("Wallet userId:", wallet.userId);
    };

    fetchRoles();
  }, []);

  const paymentOptions = [
    {
      value: "Cash Payment",
      label: "Cash Payment",
      image: "../img/cash.svg",
    },
    {
      value: "Mobile Money",
      label: "Mobile Money",
      image: "../img/mobile.svg",
    },
    {
      value: "Bank Transfer",
      label: "Bank Transfer",
      image: "../img/bank.svg",
    },
  ];
const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
const parsedUser = user ? JSON.parse(user) : null;
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <Title text="Top Up Request Details" level={4} weight="bold" />
        <button
          onClick={onClose}
          className="rounded-full border border-[#D6D8DA] p-1.5 hover:bg-gray-100"
        >
          <X size={12} color="#343A46" />
        </button>
      </div>

      {/* Request Status */}
      <div className="mt-4">
        <Status
          status={
            wallet.status.toLowerCase() as
              | "approved"
              | "declined"
              | "pending"
              | "failed"
              | "successful"
          }
        />
      </div>

      {/* Wallet Details */}
      <div className="mt-8">
        <SectionHeading text="Wallet Details" />
        <WalletBalanceCard
          availableBalance={cashBalance ? `${cashBalance}.00` : "0.00"}
          walletType={"Cash Wallet"}
          currency="₵"
        />
        <FundRequestDetails
          dateRequested={wallet.date}
          amountRequested={amountRequested}
          paymentMethod={wallet.paymentMethod}
          status={
            ["approved", "declined", "pending", "successful"].includes(
              wallet.status.toLowerCase()
            )
              ? (wallet.status.toLowerCase() as
                  | "approved"
                  | "declined"
                  | "pending"
                  | "successful")
              : "pending"
          }
          dateApproved={wallet.status === "approved" ? wallet.updatedAt : null}
          dateDeclined={wallet.status === "declined" ? wallet.updatedAt : null}
          dateSuccessful={
            wallet.status === "successful" ? wallet.updatedAt : null
          }
        />

        <div className="mt-8">
          <SectionHeading text="Reason for Request" />
          <p className="text-[16px] font-normal text-black">
            {wallet.reason || "No reason provided."}
          </p>
        </div>

        {wallet.status === "pending" && parsedUser?.roles?.includes("admin") && (
          <div className="z-40 flex flex-col gap-3 mt-8 w-[20050px]">
            <label className="text-[#080808] text-sm font-normal">
              Payment method
            </label>
            <SelectInput
              placeholder="select payment method"
              name="payment"
              options={paymentOptions}
              className="w-[637px]"
              value={paymentMethod}
              onChange={(val) => {
                setPaymentMethod(val);
                setErrors((prev) => ({ ...prev, paymentMethod: "" }));
              }}
            />
            {/* {errors.paymentMethod && (
                        <span className="text-sm text-red-500">
                          {errors.paymentMethod}
                        </span>
                      )} */}
          </div>
        )}

        <div className="mt-8">
          <SectionHeading text="Officer's Details" />
          <AgentInfoCard
            requestedBy={capitalizeFirst(roles?.join(", ") || "N/A")}
            agentId={wallet.userId}
            agentName={wallet.requestedBy}
          />
        </div>
      </div>

      {/* Action Buttons */}
      {wallet.status.toLowerCase() === "pending" && canApproveDecline && (
        <div className="mt-20 flex items-center justify-center gap-3">
          <Button
            className="h-12 w-[310px] border border-[#080808] bg-white px-[60px] py-4 text-[14px] font-medium text-[#E53F3F] hover:bg-white"
            onClick={handleDecline}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Decline"}
          </Button>
          <Button
            onClick={handleApprove}
            className="h-12 w-[310px] px-[60px] py-4 text-[14px] font-medium"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Approve Request"}
          </Button>
        </div>
      )}

      {wallet.status.toLowerCase() === "pending" && !canApproveDecline && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Only admin or paymaster can approve/decline this request
          </p>
        </div>
      )}

      {wallet.status.toLowerCase() !== "pending" && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This request has already been {wallet.status.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
};

export default FundModalContent;
