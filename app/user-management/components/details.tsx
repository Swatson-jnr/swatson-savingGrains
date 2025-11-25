"use client"


import ProgressSteps from "@/app/overview/components/progress-bar";
import Modal from "@/components/modal";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { PhoneNumberDrown } from "@/components/ui/phonenumber";
import { ChevronDown, X } from "lucide-react";
import React, { useEffect, useState } from "react";


interface DetailsModalProps {
  visible: boolean;
  headerTitle?: any;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  initialData?: {
    name?: string;
    phoneNumber?: string;
    role?: string;
    customTitle?: string;
  };
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  visible,
  headerTitle,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [branch, setBranch] = useState("");
  const [reason, setReason] = React.useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
  });

  // Extract customTitle with a default value
  const customTitle =
    initialData?.customTitle ||
    (mode === "edit" ? "Edit User" : "Add New User");

  const submitButtonText = mode === "edit" ? "Update User" : "Add User";

  const steps = [
    { title: "Request details", subtitle: "Enter request info" },
    { title: "Confirmation", subtitle: "Review and confirm" },
  ];

  useEffect(() => {
    if (initialData && mode === "edit") {
      setName(initialData.name || "");
      setFormData({ phoneNumber: initialData.phoneNumber || "" });
      setRole(initialData.role || "");
    }
  }, [initialData, mode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = "Please enter a name";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Please enter your phone number";
    if (!role) newErrors.role = "Please select a role";

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
    setName("");
    setRole("");
    setFormData({ phoneNumber: "" });
    setErrors({});
    setCurrentStep(1);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

//   const handleSubmit = () => {
//     setIsSubmitting(true);

//     // Prepare the data to send
//     const submitData: Record<string, any> = {
//       name: name,
//       phone_number: formData.phoneNumber,
//       role: role,
//     };

//     // Submit using Inertia
//     Router.post("/fatima", submitData, {
//       onSuccess: () => {
//         resetForm();
//         onClose();
//         if (onSuccess) {
//           onSuccess();
//         }
//       },
//       onError: (errors) => {
//         setErrors(errors);
//         setCurrentStep(1);
//       },
//       onFinish: () => {
//         setIsSubmitting(false);
//       },
//     });
//   };

  const expenses = {
    name: name,
    phoneNumber: formData.phoneNumber,
    role: role,
  };

  return (
    <>
      {visible && (
        <Modal
          visible={visible}
          onClose={handleCancel}
          closeOnBackgroundClick={true}
          panelClassName="!max-w-full sm:!max-w-[800px] md:!max-w-[1003px] sm:!max-h-[800px] md:!h-[987px] !overflow-visible"
        >
          <div className="flex min-h-full">
            {/* Left side - Progress & Titles */}
            <div className="flex max-h-[987px] flex-col self-stretch border-r rounded-l-2xl border-[#E7B00E] bg-[#FDFEF5] px-7 py-9">
              <div>
                <Title text={headerTitle} weight="bold" level={4} />
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
                      className="absolute right-9 top-5 rounded-full border border-gray-400 p-1.5 transition hover:bg-gray-100"
                    >
                      <X size={11} color="gray"/>
                    </button>
                  </div>

                  <div className="mb-5">
                    <Title text="User Details" level={5} weight="semibold" />
                  </div>

                  <div className="flex flex-col gap-6 text-black">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="name">Name </label>
                      <input
                        className="h-12 max-w-[572px] rounded-lg border border-[#5D616B] text-black p-5 text-[14px] font-medium outline-none"
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        placeholder="Enter user's name"
                      />
                      {errors.name && (
                        <span className="text-sm text-red-500">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Phone Number Field */}
                    <div className="flex flex-col gap-3">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <div className="flex max-w-[572px] rounded-lg border border-[#5D616B]">
                        <div className="flex items-center justify-center rounded-lg">
                          <div className="shrink-0">
                            {/* <CountryDropdown /> */}
                            <PhoneNumberDrown />
                          </div>
                        </div>
                        <input
                          id="phoneNumber"
                          type="tel"
                          placeholder="00000000000"
                          value={formData.phoneNumber}
                          onChange={(e) => {
                            handleInputChange("phoneNumber", e.target.value);
                            setErrors((prev) => ({ ...prev, phoneNumber: "" }));
                          }}
                          className="h-12 flex-1 rounded-lg text-[14px] font-medium outline-none"
                        />
                      </div>
                      {errors.phoneNumber && (
                        <span className="text-sm text-red-500">
                          {errors.phoneNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <label htmlFor="role">User Role</label>
                      <div className="relative w-full max-w-[572px]">
                        <select
                          className="h-12 w-full appearance-none rounded-lg border border-[#5D616B] bg-white px-5 pr-12 text-[14px] font-medium text-[#343A46] outline-none"
                          id="role"
                          required
                          value={role}
                          onChange={(e) => {
                            setRole(e.target.value);
                            setErrors((prev) => ({ ...prev, role: "" }));
                          }}
                        >
                          <option value="" style={{ color: "#343A46" }}>
                            Select user role
                          </option>
                          <option value="admin" style={{ color: "#343A46" }}>
                            Admin
                          </option>
                          <option value="manager" style={{ color: "#343A46" }}>
                            Manager
                          </option>
                          <option value="user" style={{ color: "#343A46" }}>
                            User
                          </option>
                          <option value="viewer" style={{ color: "#343A46" }}>
                            Viewer
                          </option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5D616B]" />
                      </div>
                      {errors.role && (
                        <span className="text-sm text-red-500">
                          {errors.role}
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
                      className="max-h-[48px] max-w-[143px] px-[60px] py-4"
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

                    <div className="mb-8">
                      <h1 className="mb-6 text-[17px] font-bold text-[#343A46]">
                        Summary
                      </h1>

                      <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                          <span className="text-[16px] text-[#5D616B]">
                            Name
                          </span>
                          <span className="text-[16px] font-medium text-[#343A46]">
                            {name}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[16px] text-[#5D616B]">
                            Phone Number
                          </span>
                          <span className="text-[16px] font-medium text-[#343A46]">
                            {formData.phoneNumber}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[16px] text-[#5D616B]">
                            User Role
                          </span>
                          <span className="text-[16px] font-medium capitalize text-[#343A46]">
                            {role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-end gap-3 pt-10">
                    <Button
                      className="border border-[#080808] bg-white px-[60px] py-4 text-[#000] hover:bg-white"
                      onClick={() => setCurrentStep(1)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                    //   onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-[#E7B00E] px-[60px] py-4 hover:bg-[#d4a00d]"
                    >
                      {isSubmitting ? "Submitting..." : submitButtonText}
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

export default DetailsModal;
