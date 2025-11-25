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
import MoveStockConfirmationDetails from "./move-stock-confirmation-details";
import { MobileMoneyInput } from "./mobileMoney-input-select";
import PayServiceConfirmationDetails from "./pay-service-confirmation-details";

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

const PayServiceModal: React.FC<RequestTopUpModalProps> = ({
  visible,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selected, setSelected] = useState("");
  const [grainType, setGrainType] = useState("");
  const [passcode, setPasscode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reference, setReference] = useState("");
  const [price, setPrice] = useState("");
  const [provider, setProvider] = useState("");
  const [service, setService] = useState<string>();
  const [to, setTo] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const steps = [
    { title: "Service details", subtitle: "Provide service info" },
    { title: "Payment details", subtitle: "Add payment details" },
    { title: "Confirmation", subtitle: "Review and confirm" },
  ];

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    if (!amount) newErrors.amount = "Amount is required";

    // if (!selectedTo) newErrors.grainType = "Select grain type";
    if (!service) newErrors.service = "Select service";
    if (!reference) newErrors.reference = "Enter reference";

    if (!quantity) newErrors.quantity = "Quantity is required";
    if (!price) newErrors.price = "Price per kilo is required";

    if (!grainType) newErrors.selected = "Please select grain";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const resetForm = () => {
    setSelected("");
    setAmount("");
    setQuantity("");
    setPrice("");
    setGrainType("");
    setPhone("");
    setProvider("");
    setReference("");
    setService("");
    setPasscode("");
    setTo("");
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
      setCurrentStep(5);
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
  const [selectedTo, setSelectedTo] = useState<Option | null>(null);

  const details = {
    grainType: grainType,
    reference: reference,
    bags: grainType,
    quantity: quantity,
    weight: quantity,
    price: price,
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
  const answerOptions = [
    { id: "1", label: "Yes", value: "Yes" },
    { id: "2", label: "No", value: "No" },
  ];
  const [measurement, setMeasurement] = useState(quantityOptions[0].value);
  const [answer, setAnswer] = useState(answerOptions[0].value);
  const providers = [
    { value: "MTN MoMo", label: "MTN MoMo", image: "../img/mtn.png" },
    { value: "AT Money", label: "AT Money", image: "../img/atigo.png" },
    {
      value: "Telecel Cash",
      label: "Telecel Cash",
      image: "../img/telecel.png",
    },
  ];

  const serviceOptions = [
    {
      value: "Rebagging",
      label: "Rebagging",
      id: 1,
    },
    {
      value: "RGrain Drying",
      label: "Grain Drying",
      id: 2,
    },
    {
      value: "Soyabean",
      label: "Soyabean",
      id: 3,
    },
    {
      value: "Others",
      label: "Others",
      id: 4,
    },
  ];

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
  return (
    <>
      {/* STEP 1 & STEP 2 MODAL */}
      {visible &&
        (currentStep === 1 || currentStep === 2 || currentStep === 3) && (
          <Modal
            visible={visible}
            // position="left"
            onClose={handleCancel}
            closeOnBackgroundClick={true}
            panelClassName="!max-w-full sm:!max-w-[800px] md:!max-w-[1003px] sm:!max-h-[800px] md:!h-[987px] !overflow-visible"
          >
            <div className="flex min-h-full">
              {/* Left side - Progress & Titles */}
              <div className="flex max-h-[1097px] flex-col rounded-l-2xl rounded-bl-2xl self-stretch border-r border-[#E7B00E] bg-[#FDFEF5] px-7 py-9">
                <div className="mb-9">
                  <Title text="Pay Service" weight="bold" level={4} />
                  <h2 className="mb-2 text-[16px] font-medium text-[#5D616B]">
                    Provide details below to continue
                  </h2>
                </div>

                <ProgressSteps steps={steps} currentStep={currentStep} />
              </div>

              {/* Right side - Form or Confirmation */}
              <div className="relative flex flex-1 flex-col px-10 pt-10 pb-6 bg-white rounded-r-2xl">
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
                        text="Service Details"
                        level={5}
                        weight="semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-4 text-black">
                      <div className="flex flex-col gap-3 ">
                        <label
                          htmlFor="amount"
                          className="text-[#080808] font-normal text-sm"
                        >
                          What stock of grain are you buying?
                        </label>
                        <SelectInput
                          placeholder="Select grain"
                          name="service"
                          options={grainOptions}
                          value={grainType}
                          onChange={(val) => {
                            setGrainType(val);
                            setErrors((prev) => ({ ...prev, selected: "" }));
                          }}
                          showBackground={false}
                        />
                        {errors.selected && (
                          <span className="text-sm text-red-500">
                            {errors.selected}
                          </span>
                        )}
                      </div>

                      <div className="z-40 flex flex-col gap-3">
                        <label className="text-sm font-normal text-[#080808]">
                          What service are paying for?
                        </label>
                        {/* <div className="flex"> */}
                        <SelectInput
                          placeholder="Select service"
                          name="service"
                          options={serviceOptions}
                          value={service}
                          onChange={(val) => {
                            setService(val);
                            setErrors((prev) => ({ ...prev, service: "" }));
                          }}
                          showBackground={false}
                        />
                        {/* </div> */}
                        {errors.service && (
                          <span className="text-sm text-red-500">
                            {errors.service}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 ">
                        <label className="text-sm font-normal text-[#080808]">
                          What amount do you want to pay?
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
                            {errors.price}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor="measure"
                          className="text-[#080808] font-normal text-sm mb-2"
                        >
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
                              setErrors((prev) => ({ ...prev, quantity: "" }));
                          }}
                          className="h-12 max-w-[572px]"
                        />
                        {errors.quantity && (
                          <span className="text-sm text-red-500">
                            {errors.quantity}
                          </span>
                        )}
                      </div>

                      <div>
                        <FloatingLabelInput
                          label="price per kilogram"
                          name="amount"
                          value={price}
                          onChange={(e) => {
                            setPrice(e.target.value),
                              setErrors((prev) => ({ ...prev, price: "" }));
                          }}
                          className="h-12 max-w-[572px]"
                        />
                        {errors.price && (
                          <span className="text-sm text-red-500">
                            {errors.price}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 ">
                        <label
                          htmlFor="amount"
                          className="text-[#080808] font-normal text-sm"
                        >
                          Additional information
                        </label>
                        <input
                          className="h-12 max-w-[572px] rounded-lg border border-[#5D616B] text-black p-5 text-[14px] font-medium outline-none"
                          id="amount"
                          type="text"
                          required
                          value={reference}
                          onChange={(e) => {
                            // const value = e.target.value.replace(/\D/g, "");
                            setReference(e.target.value);
                            setErrors((prev) => ({ ...prev, reference: "" }));
                          }}
                          placeholder="Reference"
                        />

                        {errors.reference && (
                          <span className="text-sm text-red-500">
                            {errors.reference}
                          </span>
                        )}
                      </div>
                      {/*  */}
                      <div className="flex gap-3 bg-[#F5F5F5] w-[572px] p-4 rounded-lg h-20">
                        <span className="bg-white rounded-full p-2 w-[46px] h-[46px] flex items-center justify-center">
                          <img src="../img/pos.png" alt="POS" />
                        </span>

                        <div>
                          <h1 className="text-[#5D616B] text-[16px] font-medium">
                            Cost
                          </h1>
                          <h1 className="text-[#343A46] font-bold text-[16px]">
                            GHs 0.00
                          </h1>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto flex justify-end gap-3 pt-10">
                      <Button
                        className="border border-[#080808] bg-white px-[60px] py-4 text-black hover:bg-white cursor-pointer"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleContinue}
                        className="max-h-12 max-w-[143px] px-[60px] py-4 cursor-pointer"
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
                        className="absolute right-9 top-5 rounded-full border border-[#D6D8DA] p-1.5 transition hover:bg-gray-100"
                      >
                        <X size={11} color="#343A46" />
                      </button>
                    </div>

                    <div className="mb-5">
                      <Title
                        text="Payment Details"
                        level={5}
                        weight="semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-4 text-black">
                      <div className="flex flex-col gap-3 ">
                        <label
                          htmlFor="amount"
                          className="text-[#080808] font-normal text-sm"
                        >
                          Paying to third party account?
                        </label>
                        <RadioInput
                          options={answerOptions}
                          value={answer}
                          onChange={setAnswer}
                        />

                        {errors.selected && (
                          <span className="text-sm text-red-500">
                            {errors.selected}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 ">
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
                        {errors.selected && (
                          <span className="text-sm text-red-500">
                            {errors.selected}
                          </span>
                        )}
                      </div>

                      <div className="z-40 flex flex-col gap-3">
                        <label className="text-sm font-normal text-[#080808]">
                          Payment wallet
                        </label>
                        {/* <div className="flex"> */}
                        <SelectInput
                          placeholder="Select payment wallet"
                          name="service"
                          options={paymentOptions}
                          value={paymentMethod}
                          onChange={(val) => {
                            setPaymentMethod(val);
                            setErrors((prev) => ({ ...prev, paymentMethod: "" }));
                          }}
                          showBackground={false}
                        />
                        {/* </div> */}
                        {errors.paymentMethod && (
                          <span className="text-sm text-red-500">
                            {errors.paymentMethod}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex justify-end gap-3 pt-10">
                      <Button
                        className="border border-[#080808] bg-white px-[60px] py-4 text-black hover:bg-white cursor-pointer"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleContinue}
                        className="max-h-12 max-w-[143px] px-[60px] py-4 cursor-pointer"
                      >
                        Continue
                      </Button>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="relative h-80">
                      <button
                        onClick={onClose}
                        className="absolute right-0 -top-8 rounded-full border border-[#D6D8DA] p-1.5 transition hover:bg-gray-100"
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

                      {/* <div className="flex flex-col gap-2.5 mb-5">
                        <Title
                          text="Review and sell"
                          weight="semibold"
                          level={6}
                        />
                        <p className="text-sm text-[#5D616B] font-medium">
                          Kindly confirm the details below
                        </p>
                      </div> */}

                      {/* Card content */}
                      <div className="relative w-full rounded-xl bg-white shadow-xl py-6 px-10">
                        <h1 className="text-[16px] font-bold text-[#343A46] mb-2">
                          Summary
                        </h1>
                        <PayServiceConfirmationDetails details={details} />

                        <div className="mb-4">
                          <h1 className="text-sm text-[#858990] font-medium mb-2 ">
                            Recipient
                          </h1>
                          <div className="border border-[#8796A94D] p-2 flex items-center rounded-[10px] justify-between">
                            <div className="flex items-center gap-2">
                              <div className="bg-black rounded-full inline-block p-2">
                                {/* <User size={20}/> */}
                                <img src="../img/user4.svg" alt="" />
                              </div>
                              <span className="text-sm text-[#343A46] font-bold">
                                {/* {grainType} */}
                                James Bond
                              </span>
                            </div>
                            {/*  */}
                            <div className="bg-[#F2F2F2] font-medium max-w-[102px] h-6 p-1 text-[#343A46] rounded-[10px] text-xs">
                              024 8158 8664
                            </div>
                          </div>
                        </div>
                        {/* to */}
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
                        className="bg-white text-black w-[143px] h-12 border border-[#080808] hover:bg-white cursor-pointer"
                        onClick={() => setCurrentStep(2)}
                        disabled={isSubmitting}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleContinue}
                        disabled={isSubmitting}
                        className="w-[143px] h-12 cursor-pointer"
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

      {/* {visible && currentStep === 3 && (
        <Modal
          visible={visible}
          onClose={handleCancel}
          closeOnBackgroundClick={false} // usually pin screens shouldn't close by clicking background
          panelClassName="!max-w-[468px] !h-[444px] p-20 relative"
        > */}
      {/* <CloseButton onClick={() => onclose} iconColor="#000" iconSize={30}/> */}
      {/* <div className="relative"> */}
      {/* <button
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
          /> */}
      {/* </div> */}
      {/* </Modal>
      )} */}

      {/* PIN STEP (STEP 3) */}
      {visible && currentStep === 4 && (
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

      {visible && currentStep === 5 && (
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
              setCurrentStep={() => setCurrentStep}
              processing={isSubmitting}
              reset={resetForm}
              header="Payment successful"
              subtext="Your payment for services has been successfully made."
              buttonText="Make Another Payment"
              onClose={onClose}
              onSubmit={handleSubmit}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default PayServiceModal;
