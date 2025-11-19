import { X } from "lucide-react";
import React, { useState } from "react";
import { MobileMoneyInput } from "./mobileMoney-input-select";
import ProgressSteps from "./progress-bar";
import RequestConfirmationDetails from "./request-confirmation-details";
import SelectInput from "./select-input";
import Modal from "@/components/modal";
import Title from "@/components/title";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/axios";

interface RequestTopUpModalProps {
  visible: boolean;
  onClose: () => void;
}

const PayServiceModal: React.FC<RequestTopUpModalProps> = ({
  visible,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [branch, setBranch] = useState("");
  const [reason, setReason] = React.useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: "Request details", subtitle: "Enter request info" },
    { title: "Confirmation", subtitle: "Review and confirm" },
  ];

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    if (!amount) newErrors.amount = "Please enter an amount";
    if (!paymentMethod)
      newErrors.paymentMethod = "Please select a payment method";

    if (paymentMethod === "Mobile Money") {
      if (!provider) newErrors.provider = "Please select a provider";
      if (!phone) newErrors.phone = "Please enter your mobile number";
    }

    if (paymentMethod === "Bank Transfer") {
      if (!bank) newErrors.bank = "Please select a bank";
      if (!branch) newErrors.branch = "Please select a branch";
      if (!phone) newErrors.phone = "Please enter your account number";
    }

    if (!reason) newErrors.reason = "Please provide a reason for the request";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const resetForm = () => {
    setPaymentMethod("");
    setAmount("");
    setBank("");
    setReason("");
    setBranch("");
    setProvider("");
    setPhone("");
    setErrors({});
    setCurrentStep(1);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const token =
        localStorage.getItem("access_token") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      // Helper: map various frontend payment labels to DB enum values
      const mapToModelPaymentMethod = (pm?: string) => {
        if (!pm) return null;
        const p = String(pm).toLowerCase();
        if (p === "cash" || p.includes("cash")) return "Cash Payment";
        if (
          p === "mobile_money" ||
          p.includes("mobile") ||
          p.includes("momo") ||
          p.includes("mobile money")
        )
          return "Mobile Money";
        if (
          p === "bank_transfer" ||
          p.includes("bank") ||
          p.includes("transfer") ||
          p.includes("bank transfer")
        )
          return "Bank Transfer";
        // If it already matches DB enum exactly, return as-is
        if (["Cash Payment", "Mobile Money", "Bank Transfer"].includes(pm))
          return pm;
        return null;
      };

      // Prepare request payload
      const payload: Record<string, any> = {
        amount: parseFloat(amount),
        payment_method: mapToModelPaymentMethod(paymentMethod) ?? paymentMethod,
        reason: reason.trim(),
      };

      // Log payload for debugging
      // console.log("Creating topup payload:", payload);

      // Include optional fields based on method
      if (paymentMethod === "Mobile Money") {
        payload.provider = provider;
        payload.phone_number = phone;
      } else if (paymentMethod === "Bank Transfer") {
        payload.bank_name = bank;
        payload.branch_name = branch;
        payload.phone_number = phone;
      }
      const res = await apiClient.post(
        "wallet-topup-request",
        payload, // request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.data;

      if (!data || data.error) {
        throw new Error(data?.error || "Failed to submit request");
      }
      toast.success("Top-up request submitted successfully");

      resetForm();
      onClose();
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err.message || "Submission failed");
      setErrors({ general: err.message || "Submission failed" });
      setCurrentStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const bankOptions = [
    { value: "GCB Bank", label: "GCB Bank" },
    { value: "Absa Bank", label: "Absa Bank" },
    { value: "Fidelity Bank", label: "Fidelity Bank" },
    { value: "Stanbic Bank", label: "Stanbic Bank" },
    { value: "CalBank", label: "CalBank" },
    { value: "Ecobank", label: "Ecobank" },
  ];

  const branchData: Record<string, { value: string; label: string }[]> = {
    "GCB Bank": [
      { value: "Accra Main Branch", label: "Accra Main Branch" },
      { value: "Kumasi Adum Branch", label: "Kumasi Adum Branch" },
      { value: "Tamale Central Branch", label: "Tamale Central Branch" },
    ],
    "Absa Bank": [
      { value: "Osu Branch", label: "Osu Branch" },
      { value: "Spintex Branch", label: "Spintex Branch" },
      { value: "Kumasi Suame Branch", label: "Kumasi Suame Branch" },
    ],
    "Fidelity Bank": [
      { value: "Ridge Branch", label: "Ridge Branch" },
      { value: "Tema Community 1 Branch", label: "Tema Community 1 Branch" },
      { value: "Takoradi Harbour Branch", label: "Takoradi Harbour Branch" },
    ],
    "Stanbic Bank": [
      { value: "Airport City Branch", label: "Airport City Branch" },
      { value: "Adum Branch", label: "Adum Branch" },
      { value: "Cape Coast Branch", label: "Cape Coast Branch" },
    ],
    CalBank: [
      { value: "Head Office Branch", label: "Head Office Branch" },
      { value: "Tema Main Branch", label: "Tema Main Branch" },
      { value: "Osu Branch", label: "Osu Branch" },
    ],
    Ecobank: [
      { value: "Ring Road Central Branch", label: "Ring Road Central Branch" },
      { value: "Legon Branch", label: "Legon Branch" },
      {
        value: "Kumasi Harper Road Branch",
        label: "Kumasi Harper Road Branch",
      },
    ],
  };

  const branchOptions = bank ? branchData[bank] || [] : [];

  const providers = [
    { value: "MTN MoMo", label: "MTN MoMo", image: "../img/mtn.png" },
    { value: "AT Money", label: "AT Money", image: "../img/atigo.png" },
    {
      value: "Telecel Cash",
      label: "Telecel Cash",
      image: "../img/telecel.png",
    },
  ];

  const expenses = {
    amountRequesting: amount,
    paymentMethod: paymentMethod,
    bankName: bank,
    branch: branch,
    reason,
    accountNumber: phone,
    provider: provider,
  };

  return (
    <>
      {visible && (
        <Modal
          visible={visible}
          // position="left"
          onClose={handleCancel}
          closeOnBackgroundClick={true}
          panelClassName="!max-w-full sm:!max-w-[800px] md:!max-w-[1003px] sm:!max-h-[800px] md:!h-[987px] !overflow-visible"
        >
          <div className="flex min-h-full">
            {/* Left side - Progress & Titles */}
            <div className="flex max-h-[987px] flex-col self-stretch border-r border-[#E7B00E] bg-[#FDFEF5] px-7 py-9">
              <div>
                <Title text="Pay Service" weight="bold" level={4} />
                <h2 className="mb-2 text-[16px] font-medium text-[#5D616B]">
                  Provide details below to continue
                </h2>
              </div>

              <ProgressSteps steps={steps} currentStep={currentStep} />
            </div>

            {/* Right side - Form or Confirmation */}
            <div className="relative flex flex-1 flex-col px-10 py-14">
              {currentStep === 1 && (
                <>
                  <div>
                    <button
                      onClick={onClose}
                      className="absolute right-9 top-5 rounded-full border border-[#D6D8DA] p-1.5 transition hover:bg-gray-100"
                    >
                      <X size={11} color="#343A46"/>
                    </button>
                  </div>

                  <div className="mb-5">
                    <Title text="Request Details" level={5} weight="semibold" />
                  </div>

                  <div className="flex flex-col gap-6 text-black">
                    <div className="flex flex-col gap-3 ">
                      <label htmlFor="amount" className="text-black">
                        Amount (₵) requesting{" "}
                      </label>
                      <input
                        className="h-12 max-w-[572px] rounded-lg border border-[#5D616B] text-black p-5 text-[14px] font-medium outline-none"
                        id="amount"
                        type="text"
                        required
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setAmount(value);
                          setErrors((prev) => ({ ...prev, amount: "" }));
                        }}
                        placeholder="Enter amount"
                      />
                      {errors.amount && (
                        <span className="text-sm text-red-500">
                          {errors.amount}
                        </span>
                      )}
                    </div>

                    <div className="z-40 flex flex-col gap-3">
                      <label>Payment method</label>
                      <SelectInput
                        placeholder="select payment method"
                        name="payment"
                        options={paymentOptions}
                        value={paymentMethod}
                        onChange={(val) => {
                          setPaymentMethod(val);
                          setErrors((prev) => ({ ...prev, paymentMethod: "" }));
                        }}
                      />
                      {errors.paymentMethod && (
                        <span className="text-sm text-red-500">
                          {errors.paymentMethod}
                        </span>
                      )}
                    </div>

                    {paymentMethod === "Mobile Money" && (
                      <div className="flex flex-col gap-3">
                        <label>Mobile Money Details </label>
                        <MobileMoneyInput
                          value={phone}
                          onChange={(val) => {
                            setPhone(val);
                            setErrors((prev) => ({
                              ...prev,
                              phone: "",
                            }));
                          }}
                          provider={provider}
                          onProviderChange={(val) => {
                            setProvider(val);
                            setErrors((prev) => ({
                              ...prev,
                              provider: "",
                            }));
                          }}
                          providers={providers}
                        />
                        {(errors.provider ||
                          errors.phone ||
                          errors.mobile_number) && (
                          <span className="text-sm text-red-500">
                            {errors.provider ||
                              errors.phone ||
                              errors.mobile_number}
                          </span>
                        )}
                      </div>
                    )}

                    {paymentMethod === "Bank Transfer" && (
                      <>
                        <div className="flex flex-col gap-3">
                          <label>Bank Name</label>
                          <SelectInput
                            placeholder="Select bank"
                            name="bank"
                            options={bankOptions}
                            value={bank}
                            onChange={(val) => {
                              setBank(val);
                              setBranch("");
                              setErrors((prev) => ({ ...prev, bank: "" }));
                            }}
                          />
                          {errors.bank && (
                            <span className="text-sm text-red-500">
                              {errors.bank}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          <label>Branch</label>
                          <SelectInput
                            placeholder="Select branch"
                            name="branch"
                            options={branchOptions}
                            value={branch}
                            onChange={(val) => {
                              setBranch(val);
                              setErrors((prev) => ({ ...prev, branch: "" }));
                            }}
                          />
                          {errors.branch && (
                            <span className="text-sm text-red-500">
                              {errors.branch}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          <label>Account Number </label>
                          <FloatingLabelInput
                            label="Account Number"
                            name="bank"
                            className="h-12 max-w-[572px] rounded-lg border  border-[#5D616B] p-5 outline-none"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setErrors((prev) => ({
                                ...prev,
                                phone: "",
                                account_number: "",
                              }));
                            }}
                          />
                          {(errors.phone || errors.account_number) && (
                            <span className="text-sm text-red-500">
                              {errors.phone || errors.account_number}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    <div className="flex flex-col gap-3">
                      <label htmlFor="reason">Reason</label>
                      <textarea
                        className="h-28 max-w-[572px] resize-none rounded-lg border border-[#5D616B] p-4 outline-none"
                        id="reason"
                        required
                        value={reason}
                        onChange={(e) => {
                          setReason(e.target.value);
                          setErrors((prev) => ({ ...prev, reason: "" }));
                        }}
                        placeholder="Reason for top-up request"
                      />
                      {errors.reason && (
                        <span className="text-sm text-red-500">
                          {errors.reason}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto flex justify-end gap-3 pt-10">
                    <Button
                      className="border border-[#080808] bg-white px-[60px] py-4 text-black hover:bg-white"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleContinue}
                      className="max-h-12 max-w-[143px] px-[60px] py-4"
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <button
                      onClick={onClose}
                      className="absolute right-5 top-5 rounded-full border p-1.5 transition hover:bg-gray-100"
                    >
                      <X size={11} />
                    </button>

                    <div className="mb-5">
                      <Title
                        text="Confirm Details"
                        level={5}
                        weight="semibold"
                      />
                    </div>

                    <div>
                      <h1 className="text-[17px] font-bold text-[#343A46]">
                        Summary
                      </h1>
                      <RequestConfirmationDetails expense={expenses} />
                    </div>
                  </div>

                  <div className="mt-auto flex justify-end gap-3 pt-10">
                    <Button
                      className="bg-white text-black"
                      onClick={() => setCurrentStep(1)}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PayServiceModal;
