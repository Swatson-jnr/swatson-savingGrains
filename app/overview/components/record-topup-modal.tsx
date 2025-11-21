import { CalendarIcon, X } from "lucide-react";
import React, { useState } from "react";
import DatePicker from "react-flatpickr";
import ProgressSteps from "./progress-bar";
import RecordConfirmationDetails from "./record-confirmation-details";
import SelectInput from "./select-input";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";
import Title from "@/components/title";
import "flatpickr/dist/themes/material_blue.css";
import apiClient from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";
import { format } from "path";

interface RecordTopUpModalProps {
  visible: boolean;
  onClose: () => void;
}

interface userName {
  firstName: string;
  lastName: string;
}
const RecordTransactionModal: React.FC<RecordTopUpModalProps> = ({
  visible,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grainType, setGrainType] = useState("");
  const [quantity, setQuantity] = useState("");

  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const steps = [
    { title: "Service details", subtitle: "Enter service info" },
    { title: "Confirmation", subtitle: "Review and confirm" },
  ];

  const formatDate = (d: Date | undefined) => {
  if (!d) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = d.getFullYear();
  return `${day}/ ${month}/ ${year}`;
};

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    if (!amount) newErrors.amount = "Please enter an amount";
    if (!service) newErrors.service = "Please select a service";
    if (!date) newErrors.date = "Please select transaction date";
    if (!paymentMethod)
      newErrors.paymentMethod = "Please select a payment method";

    if (!description)
      newErrors.description = "Please provide transaction's description";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // stop navigation to next step
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const resetForm = () => {
    setPaymentMethod("");
    setAmount("");
    setService("");
    setDescription("");
    setDate(undefined);
    setPhone("");
    setErrors({});
    setCurrentStep(1);
  };
  const handleCancel = () => {
    resetForm();
    setCurrentStep(1);
    onClose();
  };

  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  const userName: userName = storedUser
    ? JSON.parse(storedUser)
    : { firstName: "", lastName: "" };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await apiClient.post("transactions", {
        label: service,
        date: date,
        user: userName.firstName + " " + userName.lastName,
        amount: parseFloat(amount),
        status: "success",
        currency: "GHS",
        paymentType: paymentMethod,
        // counterparty: phone || "",
        description: description,
        metadata: {
          recordedAt: new Date().toISOString(),
        },
      });

      const data = await response.data;

      if (!data || data.error) {
        throw new Error(data?.error || "Failed to submit request");
      }
      toast.success("Transaction record submitted successfully");
      // Success - reset form and close modal
      resetForm();
      onClose();

      // Optional: Show success message/toast here
      console.log("Transaction created successfully:", response.data.data);
    } catch (error) {
      console.error("Error creating transaction:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        setErrors({
          submit: errorMessage,
        });
      } else {
        setErrors({
          submit: "Failed to create transaction. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    {
      value: "Grain Purchase",
      label: "Grain Purchase",
      image: "../img/grain.svg",
    },
    {
      value: "Service Payment",
      label: "Service Payment",
      image: "/img/service.svg",
    },
  ];
  const paymentOptions = [
    {
      value: "Cash Payment",
      label: "Cash Payment",
      image: "/img/wallet2.svg",
    },
  ];

  const details = {
   service: service,
    amount: amount,
    description: description,
    paymentMethod: paymentMethod,
    paymentDate: formatDate(date),
  };

  return (
    <>
      {visible && (
        <Modal
          visible={visible}
          onClose={handleCancel}
          closeOnBackgroundClick={true}
          panelClassName="!max-w-full sm:!max-w-[800px] md:!max-w-[1003px] sm:!max-h-[800px] md:!h-[987px] lg:!max-h-[10907px] !overflow-visible"
        >
          <div className="flex min-h-full text-black">
            {/* Left side - Progress & Titles */}
            <div className="flex max-h-[987px] flex-col self-stretch bg-[#FDFEF5] rounded-l-2xl rounded-bl-2xl  border-r border-[#E7B00E] px-7 py-9">
              <div>
                <Title text="Record Transaction" weight="bold" level={4} />
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
                      className="absolute right-9 top-5 rounded-full border p-1.5 transition hover:bg-gray-100"
                    >
                      <X size={11} />
                    </button>
                  </div>

                  <div className="mb-5">
                    <Title text="Service Details" level={5} weight="semibold" />
                  </div>

                  <div className="z-40 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="amount"
                        className="text-[14px] font-normal text-[#343A46]"
                      >
                        What service are you paying for?
                      </label>
                      <SelectInput
                        placeholder="Select service "
                        name="service"
                        options={serviceOptions}
                        value={service}
                        onChange={(val) => {
                          setService(val);
                          setErrors((prev) => ({ ...prev, service: "" }));
                        }}
                        showBackground={false}
                      />
                      {errors.service && (
                        <span className="text-sm text-red-500">
                          {errors.service}
                        </span>
                      )}
                    </div>

                    {/* <div className="z-40 flex flex-col gap-3"> */}
                    <div className="flex flex-col gap-3">
                      <label>Amount paid</label>
                      <input
                        className="h-12 max-w-[572px] rounded-lg border border-[#5D616B] p-5 text-[14px] font-medium outline-none"
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
                    <div className="flex flex-col gap-3">
                      <label>Description</label>
                      <FloatingLabelInput
                        label="Enter description"
                        name="description"
                        className="h-12 max-w-[572px] rounded-lg border border-[#5D616B] p-5 text-[14px] font-medium outline-none"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setErrors((prev) => ({ ...prev, description: "" }));
                        }}
                      />
                      {errors.description && (
                        <span className="text-sm text-red-500">
                          {errors.description}
                        </span>
                      )}
                    </div>
                    <div className="relative flex flex-col gap-3">
                      <label>Date</label>
                      <DatePicker
                        value={date}
                        onChange={(selectedDates) => {
                          setDate(selectedDates[0]);
                          setErrors((prev) => ({ ...prev, date: "" }));
                        }}
                        options={{
                          dateFormat: "d/m/Y",
                          allowInput: true,
                        }}
                        placeholder="DD/M/YYYY"
                        className="h-[48px] max-w-[572px] rounded-[8px] border border-[#5D616B] p-5 text-[14px] font-medium outline-none"
                      />
                      <CalendarIcon className="pointer-events-none absolute right-14 top-14 h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                      {errors.date && (
                        <span className="text-sm text-red-500">
                          {errors.date}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="amount"
                        className="text-[14px] font-normal text-[#343A46]"
                      >
                        Payment method
                      </label>
                      <SelectInput
                        placeholder="Select service "
                        name="payment"
                        options={paymentOptions}
                        value={paymentMethod}
                        onChange={(val) => {
                          setPaymentMethod(val);
                          setErrors((prev) => ({ ...prev, paymentMethod: "" }));
                        }}
                        showBackground={false}
                      />
                      {errors.paymentMethod && (
                        <span className="text-sm text-red-500">
                          {errors.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto flex justify-end gap-3 pt-10">
                    <Button
                      className="border border-[#080808] bg-white px-[60px] py-4 text-[#000] hover:bg-white"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleContinue}
                      className="max-h-[48px] max-w-[143px] px-[60px] py-4 bg-[#E7B00E] text-white"
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
                      <RecordConfirmationDetails details={details} />
                    </div>
                  </div>

                  <div className="mt-auto flex justify-end gap-3 pt-10">
                    <Button
                      className="bg-white text-black hover:bg-white"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button onClick={handleSubmit}>Submit</Button>
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

export default RecordTransactionModal;
