import { X } from "lucide-react";
import React, { useState } from "react";
import ProgressSteps from "./progress-bar";
import RequestConfirmationDetails from "./request-confirmation-details";
import SelectInput from "./select-input";
import Modal from "@/components/modal";
import Title from "@/components/title";
import { FloatingLabelInput } from "@/components/floating-input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import RadioInput from "@/components/forms/radio-input";
import RecordConfirmationDetails from "./record-confirmation-details";
import { Success } from "@/components/succes";
import ReceiveStockConfirmationDetails from "./receive-stock-confirmation-details";

interface RequestTopUpModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface Option {
  id: number | string;
  label: string;
  value: string;
  category?: string;
}

const ReceiveStockModal: React.FC<RequestTopUpModalProps> = ({
  visible,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [farmerAge, setFarmerAge] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [bank, setBank] = useState("");
  const [branch, setBranch] = useState("");
  const [grainType, setGrainType] = useState("");

  const [reason, setReason] = React.useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: "Transfer details", subtitle: "Enter stock info" },
    { title: "Confirmation", subtitle: "Review and confirm" },
  ];

  const handleContinue = () => {
    // const newErrors: Record<string, string> = {};

    // if (!amount) newErrors.amount = "Please enter an amount";
    // if (!paymentMethod)
    //   newErrors.paymentMethod = "Please select a payment method";

    // if (paymentMethod === "Mobile Money") {
    //   if (!provider) newErrors.provider = "Please select a provider";
    //   if (!phone) newErrors.phone = "Please enter your mobile number";
    // }

    // if (paymentMethod === "Bank Transfer") {
    //   if (!bank) newErrors.bank = "Please select a bank";
    //   if (!branch) newErrors.branch = "Please select a branch";
    //   if (!phone) newErrors.phone = "Please enter your account number";
    // }

    // if (!reason) newErrors.reason = "Please provide a reason for the request";

    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors);
    //   return;
    // }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 4));
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
    setShowLoader(true); // Show loader

    try {
      // Simulate API call (replace with your actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // On success, hide loader and show success screen
      setShowLoader(false);
      setCurrentStep(4);
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err.message || "Submission failed");
      setErrors({ general: err.message || "Submission failed" });
      setShowLoader(false);
      setCurrentStep(3); // Go back to PIN step
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

  const details = {
    grainType: grainType,
    quantity: quantity,
    price: amount,
    charges: "200",
    date: "22/22/22",
  };

  const genderOptions = [
    { id: "1", label: "Male", value: "Male" },
    { id: "2", label: "Female", value: "Female" },
  ];

  const quantityOptions = [
    { id: "1", label: "Weight(kg)", value: "Weight(kg)" },
    { id: "2", label: "Bags", value: "Bags" },
  ];

  const [farmerGender, setFarmerGender] = useState(genderOptions[0].value);
  const [measurement, setMeasurement] = useState(quantityOptions[0].value);
  const [selected, setSelected] = useState<Option | null>(null);

  return (
    <>
      {visible && (currentStep === 1 || currentStep === 2) && (
        <Modal
          visible={visible}
          // position="left"
          onClose={handleCancel}
          closeOnBackgroundClick={true}
          panelClassName="!max-w-full sm:!max-w-[800px] md:!max-w-[1003px] md:!h-[1027px] overflow-visible"
        >
          <div className="flex min-h-full">
            {/* Left side - Progress & Titles */}
            <div className="flex max-h-[1027px] flex-col self-stretch rounded-l-2xl rounded-bl-2xl  border-r border-[#E7B00E] bg-[#FDFEF5] px-7 py-9">
              <div>
                <Title text="Receive Stock" weight="bold" level={4} />
                <h2 className="mb-2 text-[16px] font-medium text-[#5D616B]">
                  Provide details below to continue
                </h2>
              </div>

              <ProgressSteps steps={steps} currentStep={currentStep} />
            </div>

            {/* Right side - Form or Confirmation */}
            <div className="relative flex flex-1 flex-col px-10 py-14 h-140">
              {currentStep === 1 && (
                <>
                  <div>
                    <button
                      onClick={onClose}
                      className="absolute right-9 top-5 rounded-full border border-[#D6D8DA] p-1.5 transition hover:bg-gray-100"
                    >
                      <X size={11} color="#343A46" />
                    </button>
                  </div>

                  <div className="mb-5">
                    <Title
                      text="Transfer Details"
                      level={5}
                      weight="semibold"
                    />
                  </div>

                  <div className="flex flex-col gap-6 text-black">
                    <div className="flex flex-col gap-3 ">
                      <label htmlFor="amount" className="text-[#343A46]">
                        Transferring from
                      </label>
                      <SelectInput
                        placeholder="Select grain"
                        name="service"
                        options={paymentOptions}
                        value={grainType}
                        onChange={(val) => {
                          setGrainType(val);
                          setErrors((prev) => ({ ...prev, grainType: "" }));
                        }}
                        showBackground={false}
                      />
                      {/* {errors.amount && (
                        <span className="text-sm text-red-500">
                          {errors.amount}
                        </span>
                      )} */}
                    </div>

                    <div className="z-40 flex flex-col gap-3">
                      <label>Farmer's name</label>
                      <input
                        className="h-12 max-w-[572px] rounded-lg border border-[#5D616B] text-black p-5 text-[14px] font-medium outline-none"
                        id="farmerName"
                        type="text"
                        required
                        value={farmerName}
                        onChange={(e) => {
                          setFarmerName(e.target.value);
                          setErrors((prev) => ({ ...prev, amount: "" }));
                        }}
                        placeholder="Enter Framer's name"
                      />
                    </div>
                    <div className="z-40 flex flex-col gap-3">
                      <label>Farmer's phone number</label>
                      <input
                        className="h-12 max-w-[572px] rounded-lg border border-[#5D616B] text-black p-5 text-[14px] font-medium outline-none"
                        id="farmerPhone"
                        type="text"
                        required
                        value={farmerPhone}
                        onChange={(e) => {
                          setFarmerPhone(e.target.value);
                          setErrors((prev) => ({ ...prev, amount: "" }));
                        }}
                        placeholder="Enter Framer's name"
                      />
                      {/* {errors.paymentMethod && (
                        <span className="text-sm text-red-500">
                          {errors.paymentMethod}
                        </span>
                      )} */}
                    </div>
                    <div className="z-40 flex flex-col gap-3">
                      <label>Farmer's gender</label>
                      <RadioInput
                        options={genderOptions}
                        value={farmerGender}
                        onChange={setFarmerGender}
                      />
                      {/* {errors.paymentMethod && (
                        <span className="text-sm text-red-500">
                          {errors.paymentMethod}
                        </span>
                      )} */}
                    </div>

                    <div className="z-40 flex flex-col gap-3">
                      <label>Farmer's age</label>
                      <input
                        className="h-12 max-w-[572px] rounded-lg border border-[#5D616B] text-black p-5 text-[14px] font-medium outline-none"
                        id="farmerName"
                        type="text"
                        required
                        value={farmerAge}
                        onChange={(e) => {
                          setFarmerAge(e.target.value);
                          setErrors((prev) => ({ ...prev, amount: "" }));
                        }}
                        placeholder="Enter Framer's name"
                      />
                      {/* {errors.paymentMethod && (
                        <span className="text-sm text-red-500">
                          {errors.paymentMethod}
                        </span>
                      )} */}
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="measure" className="mb-2">
                        Quantity measurement
                      </label>
                      <RadioInput
                        options={quantityOptions}
                        value={measurement}
                        onChange={setMeasurement}
                      />
                    </div>

                    <div>
                      <FloatingLabelInput
                        label="Enter quantity"
                        name="amount"
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value),
                            setErrors((prev) => ({ ...prev, amount: "" }));
                        }}
                        className="h-12 max-w-[572px]"
                      />
                      {/* {errors.amount && (
                        <span className="text-sm text-red-500">
                          {errors.amount}
                        </span>
                      )} */}
                    </div>

                    <div>
                      <FloatingLabelInput
                        label="price per kilogram"
                        name="amount"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value),
                            setErrors((prev) => ({ ...prev, quantity: "" }));
                        }}
                        className="h-12 max-w-[572px]"
                      />
                      {/* {errors.quantity && (
                        <span className="text-sm text-red-500">
                          {errors.quantity}
                        </span>
                      )} */}
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
                  <button
                    onClick={onClose}
                    className="absolute right-9 top-5 rounded-full border border-[#D6D8DA] p-1.5 transition hover:bg-gray-100"
                  >
                    <X size={11} color="#343A46" />
                  </button>

                  <div className="mb-5">
                    <Title text="Confirm Details" level={5} weight="semibold" />
                  </div>

                  <div className="flex flex-col gap-2.5 mb-5">
                    <Title text="Confirm payment" weight="semibold" level={6} />
                    <p className="text-sm text-[#5D616B] font-medium">
                      Provide details below to continue
                    </p>
                  </div>

                  {/* Card content */}
                  <div className="relative w-full rounded-xl bg-white shadow-2xl py-6 px-10 mb-6">
                    <h1 className="text-[16px] font-bold text-[#343A46] mb-4">
                      Summary
                    </h1>
                    {/* <StockConfirmationDetails details={details} /> */}
                    <ReceiveStockConfirmationDetails details={details} />

                    <div className="mb-8">
                      <h1 className="text-sm text-[#858990] font-medium mb-2 ">
                        Farmer's details
                      </h1>
                      <div className="border border-[#D6D8DA] p-2 flex items-center rounded-[10px] gap-10">
                        <div className="flex items-center gap-2">
                          <div className="bg-black rounded-full inline-block p-2">
                            <img src="../img/user4.svg" alt="" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-[#343A46] font-bold">
                              {farmerName}
                            </span>
                            <span className="text-xs text-[#343A46] font-normal">
                              {farmerAge}
                            </span>
                          </div>
                        </div>
                        <div className="bg-[#F2F2F2] font-medium max-w-[102px] h-6 p-1 text-[#343A46] rounded-[10px] text-xs">
                          0244343434
                        </div>
                      </div>
                    </div>
                    {/* Aggregator */}
                    <div className="mb-8">
                      <h1 className="text-sm text-[#858990] font-medium mb-2 ">
                        Aggregator
                      </h1>
                      <div className="border border-[#D6D8DA] p-2 flex items-center rounded-[10px] gap-10">
                        <div className="flex items-center gap-2">
                          <div className="bg-black rounded-full inline-block p-2">
                            <img src="../img/user4.svg" alt="" />
                          </div>
                          <span className="text-sm text-[#343A46] font-bold">
                            {/* {farmerName} */}James Baldwin
                          </span>
                        </div>
                        <div className="bg-[#F2F2F2] font-medium max-w-[102px] h-6 p-1 text-[#343A46] rounded-[10px] text-xs">
                          0244343434
                        </div>
                      </div>
                    </div>
                    {/*  */}
                  </div>
                  <div className="-mt-17">
                    <svg
                      className="w-full rotate-180"
                      viewBox="0 0 400 30"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <pattern
                          id="tear"
                          x="90"
                          y="0"
                          width="40"
                          height="30"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M0,0 Q10,15 20,0 T40,0"
                            fill="#D9D9D9"
                            stroke="none"
                          />
                        </pattern>
                      </defs>
                      <rect width="400" height="30" fill="url(#tear)" />
                    </svg>
                  </div>

                  {/* Buttons at the bottom */}
                  <div className="mt-40 flex justify-end gap-3 pt-4">
                    <Button
                      className="bg-white text-black w-[143px] h-12 border border-[#080808] hover:bg-white"
                      onClick={() => setCurrentStep(1)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-[143px] h-12"
                    >
                      {isSubmitting ? "Submitting..." : "Continue"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {visible && showLoader && (
        <Modal
          visible={visible}
          onClose={() => {}} // Prevent closing during loading
          closeOnBackgroundClick={false}
          panelClassName="!max-w-full sm:!max-w-[800px] bg-white/10 backdrop-blur-lg md:!max-w-[1003px] md:!h-[1027px] overflow-visible"
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {/* Your golden loader component */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient
                    id="spinnerGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#E7B00E" stopOpacity="0" />
                    <stop offset="50%" stopColor="#E7B00E" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#E7B00E" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f5f5f5"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#spinnerGradient)"
                  strokeWidth="8"
                  strokeDasharray="62.8 188.4"
                  strokeLinecap="round"
                  style={{
                    animation: "spin 0.4s linear infinite",
                    transformOrigin: "center",
                  }}
                />
              </svg>
            </div>
            <div className="text-2xl font-bold text-black">
                   Loading
                  </div>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </Modal>
      )}

      {visible && currentStep === 4 && (
        <Modal
          visible={visible}
          onClose={handleCancel}
          closeOnBackgroundClick={true} // usually pin screens shouldn't close by clicking background
          panelClassName="!max-w-[468px] !h-[444px] p-4 relative"
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-0 -top-2 cursor-pointer rounded-full border border-[#D6D8DA] p-1.5 transition hover:bg-gray-100"
            >
              <X size={20} color="#343A46" />
            </button>

            <Success
              setCurrentStep={setCurrentStep}
              processing={isSubmitting}
              reset={resetForm}
              buttonText="Receive Again"
              onClose={onClose}
              onSubmit={handleSubmit}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ReceiveStockModal;
