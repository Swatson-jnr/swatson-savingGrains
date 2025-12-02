import { User, X } from "lucide-react";
import React, { useState } from "react";
// import { MobileMoneyInput } from "./mobileMoney-input-select";
import ProgressSteps from "./progress-bar";
// import RequestConfirmationDetails from "./request-confirmation-details";
import SelectInput from "./select-input";
import Modal from "@/components/modal";
import Title from "@/components/title";
// import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import SearchableSelect from "@/components/forms/searchable-select";
// import { Radio } from "@headlessui/react";
import RadioInput from "@/components/forms/radio-input";
import StockConfirmationDetails from "./stock-confirmation-details";
import { FloatingLabelInput } from "@/components/floating-input";
import { PinStep } from "@/components/forms/pin-step";
import CloseButton from "@/components/close-button";
import { StockPinStep } from "./stock-pin";
import { Success } from "@/components/succes";

interface RequestTopUpModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Product {
  id: number;
  label: string;
  icon: string;
  value: string;
  category?: string;
}

export interface Option {
  id: number | string;
  label: string;
  value: string;
  category?: string;
}

const SellStockModal: React.FC<RequestTopUpModalProps> = ({
  visible,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  // const [company, setCompany] = useState("");
  const [bank, setBank] = useState("");
  const [branch, setBranch] = useState("");
  const [passcode, setPasscode] = useState("");
  // const [service, setService] = useState("");
  const [grainType, setGrainType] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const steps = [
    { title: "Stock details", subtitle: "Enter stock info" },
    { title: "Confirmation", subtitle: "Review and confirm" },
  ];

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    if (!amount) newErrors.amount = "Please enter an amount";

    if (!grainType) newErrors.grainType = "Select grain type";

    if (!quantity) newErrors.quantity = "Please enter quantity";

    if (!selected) newErrors.selected = "Please select a company";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const resetForm = () => {
    setSelected(null);
    setAmount("");
    setQuantity("");
    setGrainType("");
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
  const products: Product[] = [
    {
      id: 1,
      label: "COP Co. Ltd Warehouse",
      icon: "",
      value: "COP Co. Ltd Warehouse",
      category: "Electronics",
    },
    {
      id: 1,
      label: "COP Co. Ltd Warehouse",
      icon: "",
      value: "COP Co. Ltd Warehouse",
      category: "Electronics",
    },
    {
      id: 1,
      label: "COP Co. Ltd Warehouse",
      icon: "",
      value: "COP Co. Ltd Warehouse",
      category: "Electronics",
    },
    {
      id: 1,
      label: "COP Co. Ltd Warehouse",
      icon: "",
      value: "COP Co. Ltd Warehouse",
      category: "Electronics",
    },
    {
      id: 1,
      label: "COP Co. Ltd Warehouse",
      icon: "",
      value: "COP Co. Ltd Warehouse",
      category: "Electronics",
    },
    {
      id: 1,
      label: "COP Co. Ltd Warehouse",
      icon: "",
      value: "COP Co. Ltd Warehouse",
      category: "Electronics",
    },
    {
      id: 1,
      label: "COP Co. Ltd Warehouse",
      icon: "",
      value: "COP Co. Ltd Warehouse",
      category: "Electronics",
    },
    {
      id: 2,
      label: "Product 2",
      value: "prod2",
      icon: "",
      category: "Clothing",
    },
  ];
  const [selected, setSelected] = useState<Option | null>(null);

  const details = {
    grainType: grainType,
    quantity: quantity,
    price: amount,
    charges: "200",
    date: "22/22/22",
  };

  const grainOptions = [
    {
      value: "White Maize",
      label: "White Maize",
      image: "../img/whiteMaize.png",
    },
    {
      value: "Yellow Maize",
      label: "Yellow Maize",
      image: "../img/yellowMaize.png",
    },
    {
      value: "Groundnut",
      label: "Groundnut",
      image: "../img/groundnut.svg",
    },
    {
      value: "Cowpea",
      label: "Cowpea",
      image: "../img/cowpea.svg",
    },
    {
      value: "Soyabean",
      label: "Soyabean",
      image: "../img/soyabean.svg",
    },
    {
      value: "Sesame",
      label: "Sesame",
      image: "../img/sesame.png",
    },
  ];

  const quantityOptions = [
    { id: "1", label: "Weight(kg)", value: "Weight(kg)" },
    { id: "2", label: "Bags", value: "Bags" },
  ];
  const [measurement, setMeasurement] = useState(quantityOptions[0].value);

  return (
    <>
      {/* STEP 1 & STEP 2 MODAL */}
      {visible && (currentStep === 1 || currentStep === 2) && (
        <Modal
          visible={visible}
          // position="left"
          onClose={handleCancel}
          closeOnBackgroundClick={true}
          panelClassName="!max-w-full sm:!max-w-[800px] md:!max-w-[1003px] sm:!max-h-[800px] md:!h-[987px] !overflow-visible"
        >
          <div className="flex min-h-full">
            {/* Left side - Progress & Titles */}
            <div className="flex max-h-[987px] flex-col rounded-l-2xl rounded-bl-2xl self-stretch border-r border-[#E7B00E] bg-[#FDFEF5] px-7 py-9">
              <div>
                <Title text="Sell Stocks" weight="bold" level={4} />
                <h2 className="mb-2 text-[16px] font-medium text-[#5D616B]">
                  Provide details below to continue
                </h2>
              </div>

              <ProgressSteps steps={steps} currentStep={currentStep} />
            </div>

            {/* Right side - Form or Confirmation */}
            <div className="relative flex flex-1 flex-col px-10 pt-14 pb-6">
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
                    <Title text="Stock Details" level={5} weight="semibold" />
                  </div>

                  <div className="flex flex-col gap-6 text-black">
                    <div className="flex flex-col gap-3 ">
                      <label
                        htmlFor="amount"
                        className="text-[#343A46] font-semibold text-sm"
                      >
                        Selling to
                      </label>
                      <SearchableSelect
                        // label="Select company"
                        value={selected}
                        onChange={(option) => {
                          setSelected(option);
                          setErrors((prev) => ({ ...prev, selected: "" }));
                        }}
                        options={products}
                      />
                      {errors.selected && (
                        <span className="text-sm text-red-500">
                          {errors.selected}
                        </span>
                      )}
                    </div>

                    <div className="z-40 flex flex-col gap-3">
                      <label className="text-sm font-normal text-[#080808]">
                        What grain are you selling?{" "}
                      </label>
                      {/* <div className="flex"> */}
                      <SelectInput
                        placeholder="Select grain"
                        name="service"
                        options={grainOptions}
                        value={grainType}
                        onChange={(val) => {
                          setGrainType(val);
                          setErrors((prev) => ({ ...prev, grainType: "" }));
                        }}
                        showBackground={false}
                      />
                      {/* </div> */}
                      {errors.grainType && (
                        <span className="text-sm text-red-500">
                          {errors.grainType}
                        </span>
                      )}
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
                      {errors.amount && (
                        <span className="text-sm text-red-500">
                          {errors.quantity}
                        </span>
                      )}
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
                      {errors.quantity && (
                        <span className="text-sm text-red-500">
                          {errors.amount}
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
                  <div className="relative h-80">
                    <button
                      onClick={onClose}
                      className="absolute right-0 -top-10 rounded-full border border-[#D6D8DA] p-1.5 transition hover:bg-gray-100"
                    >
                      <X size={11} color="#343A46" />
                    </button>

                    <div className="mb-5">
                      <Title
                        text="Confirm Details"
                        level={5}
                        weight="semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-2.5 mb-5">
                      <Title
                        text="Review and sell"
                        weight="semibold"
                        level={6}
                      />
                      <p className="text-sm text-[#5D616B] font-medium">
                        Kindly confirm the details below
                      </p>
                    </div>

                    {/* Card content */}
                    <div className="relative w-full rounded-xl bg-white shadow-2xl py-6 px-10">
                      <h1 className="text-[16px] font-bold text-[#343A46] mb-4">
                        Summary
                      </h1>
                      <StockConfirmationDetails details={details} />

                      <div className="mb-4">
                        <h1 className="text-sm text-[#858990] font-medium mb-2 ">
                          Selling to
                        </h1>
                        <div className="border border-[#D6D8DA] p-2 flex items-center rounded-[10px] justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-black rounded-full inline-block p-2">
                              {/* <User size={20}/> */}
                              <img src="../img/user4.svg" alt="" />
                            </div>
                            <span className="text-sm text-[#343A46] font-bold">
                              {selected?.label}
                            </span>
                          </div>
                          {/*  */}
                          <div className="bg-[#D6D8DA] font-medium max-w-[102px] h-6 p-1 text-[#343A46] rounded-[10px] text-xs">
                            0244343434
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TEAR now moved outside the card */}
                    <svg
                      className="w-full -mt-11 rotate-180"
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

                  {/* Buttons below the tear */}
                  <div className="flex justify-end gap-3 pt-10 mt-auto">
                    <Button
                      className="bg-white text-black w-[143px] h-12 border border-[#080808]"
                      onClick={() => setCurrentStep(1)}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleContinue}
                      disabled={isSubmitting}
                      className="w-[143px] h-12 "
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

      {/* PIN STEP (STEP 3) */}
      {visible && currentStep === 3 && (
        <Modal
          visible={visible}
          onClose={handleCancel}
          closeOnBackgroundClick={false} // usually pin screens shouldn't close by clicking background
          panelClassName="!max-w-[468px] !h-[444px] p-20 relative"
        >
          {/* <CloseButton onClick={() => onclose} iconColor="#000" iconSize={30}/> */}
          {/* <div className="relative"> */}
          <button
            onClick={onClose}
            className="absolute -right-10 -top-16 rounded-full border border-[#D6D8DA] p-1.5 transition hover:bg-gray-100"
          >
            <X size={20} color="#343A46" />
          </button>
          <StockPinStep
            phone={phone}
            passcode={passcode}
            setCurrentStep={setCurrentStep}
            processing={isSubmitting}
            errors={errors}
            onClose={onClose}
            onPasscodeChange={setPasscode}
            onSubmit={handleSubmit}
          />
          {/* </div> */}
        </Modal>
      )}

      {/* LOADING STEP */}
      {visible && showLoader && (
        <Modal
          visible={visible}
          onClose={() => {}} // Prevent closing during loading
          closeOnBackgroundClick={false}
          panelClassName="!max-w-[468px] !h-[444px] p-20 relative bg-white/10 backdrop-blur-lg"
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
            {/* <div className="text-2xl font-semibold text-black">
              Processing...
            </div> */}
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
              buttonText="Sell Again"
              onClose={onClose}
              onSubmit={handleSubmit}
              subtext="Your grain transfer is in motion, ensuring a seamless move to warehouse with precision and care."
              header="Transfer successfully initiated"
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default SellStockModal;
