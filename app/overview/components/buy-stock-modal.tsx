import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MobileMoneyInput } from "./mobileMoney-input-select";
import ProgressSteps from "./progress-bar";
import SelectInput from "./select-input";
import Modal from "@/components/modal";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import PhoneInput from "@/components/forms/country-phone-input";
import RadioInput from "@/components/forms/radio-input";
import { FloatingLabelInput } from "@/components/floating-input";
import BuytockConfirmationDetails from "./buy-stock-confirmation-details";
import SmartSelectInput from "@/components/forms/select-input";
import Farmer from "@/lib/models/farmer";
import CheckBox from "@/components/forms/chexkbox";
import { StockPinStep } from "./stock-pin";
import { Success } from "@/components/succes";
import { set } from "mongoose";
import NormalSelect from "@/components/forms/normal-select";

type Farmer = {
  _id: string;
  gender: string;
  name: string;
  age: string;
  phoneNumber: string;
};
type Seller = {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
};

interface RequestTopUpModalProps {
  visible: boolean;
  onClose: () => void;
  farmers?: Farmer[] | null;
  sellers?: Seller[] | null;
}

const BuyStockModal: React.FC<RequestTopUpModalProps> = ({
  visible,
  onClose,
  farmers,
  sellers,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [grainType, setGrainType] = useState("");
  const [branch, setBranch] = useState("");
  const [reason, setReason] = React.useState("");
  const [phone, setPhone] = useState("");
  const [farmer, setFarmer] = useState("");
  const [bagSize, setBagSize] = useState("");
  const [passcode, setPasscode] = useState("");

  // Add new states for storing IDs
  const [sellerId, setSellerId] = useState("");
  const [seller, setSeller] = useState("");
  const [farmerId, setFarmerId] = useState("");

  const [farmerNumber, setFarmerNumber] = useState("");
  const [farmerAge, setFarmerAge] = useState("");
  const [provider, setProvider] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [checked, setChecked] = useState(false);

  const steps = [
    { title: "Stock details", subtitle: "Enter stock info" },
    { title: "Farmer details", subtitle: "Fill in farmer info" },
    { title: "Payment details", subtitle: "Add payment details" },
    { title: "Confirmation", subtitle: "Review and confirm" },
  ];

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    // Step 1: Stock Details validation
    if (currentStep === 1) {
      if (!grainType) newErrors.grainType = "Please select a grain type";
      if (!seller) newErrors.seller = "Please select a seller";
    }

    // Step 2: Farmer Details validation
    if (currentStep === 2) {
      if (!farmer) newErrors.farmer = "Please select or add a farmer";
      if (!farmerNumber) newErrors.farmerNumber = "Please enter phone number";
      if (!gender) newErrors.gender = "Please select a gender";
      if (!farmerAge) newErrors.farmerAge = "Please enter farmer's age";
    }

    // Step 3: Payment Details validation
    if (currentStep === 3) {
      if (!answer) newErrors.answer = "Please select payment option";
      if (answer === "Yes" && !phone) {
        newErrors.phone = "Please enter third party phone number";
      }
      if (!provider)
        newErrors.provider = "Please select a mobile money provider";
      if (!measurement)
        newErrors.measurement = "Please select quantity measurement";
      if (!quantity) newErrors.quantity = "Please enter quantity";
      if (!price) newErrors.price = "Please enter price";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 5));
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
    setPasscode("");
    setCurrentStep(1);
    setSellerId("");
    setSeller("");
    setBagSize("");
    setFarmerId("");
    setGrainType("");
    setFarmer("");
    setFarmerNumber("");
    setFarmerAge("");
    setGender(genderOptions[0].value);
    setAnswer(answerOptions[1].value);
    setMeasurement(quantityOptions[0].value);
    setQuantity("");
    setPrice("");
    setChecked(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    // Step 1: Validate form
    if (!farmerId) {
      toast.error("Missing required information");
      setCurrentStep(1);
      return;
    }

    // Step 2: Ask for PIN
    // const passcode = prompt("Enter your 4-digit PIN to authorize purchase:");
    if (!passcode) {
      toast.error("PIN is required");
      return;
    }

    if (!/^\d{4}$/.test(passcode)) {
      toast.error("PIN must be 4 digits");
      return;
    }

    setIsSubmitting(true);
    setShowLoader(true);

    try {
      // Step 3: Verify PIN first
      const verifyRes = await apiClient.post(
        "users/verify-pin",
        { passcode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!verifyRes.data?.success) {
        toast.error("Invalid PIN");
        setShowLoader(false);
        return;
      }

      // Step 4: PIN Verified → Continue with purchase
      const purchaseData = {
        farmerId,
        grainType,
        quantity: parseFloat(quantity),
        sellerId,
        measurementUnit: measurement,
        pricePerUnit: parseFloat(price),
        charges: 200,
        paymentPhoneNumber: answer === "Yes" ? phone : farmerNumber,
        isThirdPartyPayment: answer === "Yes",
        moveToStorehouse: checked,
        purchaseDate: new Date().toISOString(),
      };

      console.log("Submitting purchase:", purchaseData);

      const response = await apiClient.post("purchases", purchaseData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.data.success) {
        setShowLoader(false);
        setCurrentStep(6);
        toast.success("Purchase created successfully!");
      } else {
        throw new Error(response.data.error || "Purchase creation failed");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Submission failed. Please try again.";

      toast.error(errorMessage);
      setErrors({ general: errorMessage });
      setShowLoader(false);
      setCurrentStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const sellerOptions = [
    {
      value: "Farmer",
      label: "Farmer",
      image: "../img/Grains.png",
    },
    {
      value: "Field Agent",
      label: "Field Agent",
      image: "../img/agent.png",
    },
  ];

  const grainOptions = [
    {
      id: "grain_id_1",
      value: "White Maize",
      label: "White Maize",
      image: "../img/whiteMaize.png",
    },
    {
      id: "grain_id_2",
      value: "Yellow Maize",
      label: "Yellow Maize",
      image: "../img/yellowMaize.png",
    },
    {
      id: "grain_id_3",
      value: "Groundnut",
      label: "Groundnut",
      image: "../img/groundnut.svg",
    },
    {
      id: "grain_id_4",
      value: "Cowpea",
      label: "Cowpea",
      image: "../img/cowpea.svg",
    },
    {
      id: "grain_id_5",
      value: "Soyabean",
      label: "Soyabean",
      image: "../img/soyabean.svg",
    },
    {
      id: "grain_id_6",
      value: "Sesame",
      label: "Sesame",
      image: "../img/sesame.png",
    },
  ];

  const genderOptions = [
    { id: "1", label: "Male", value: "Male" },
    { id: "2", label: "Female", value: "Female" },
  ];

  const [gender, setGender] = useState(genderOptions[0].value);

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const answerOptions = [
    { id: "1", label: "Yes", value: "Yes" },
    { id: "2", label: "No", value: "No" },
  ];

  const quantityOptions = [
    { id: "1", label: "Weight(kg)", value: "KG" },
    { id: "2", label: "Bags", value: "BAG" },
  ];

  const [answer, setAnswer] = useState(answerOptions[1].value);
  const [measurement, setMeasurement] = useState(quantityOptions[0].value);
  const [price, setPrice] = useState("");

  const details = {
    grainType,
    quantity,
    measurement,
    price,
    charges: "200",
    date: "22/22/22",
  };

  useEffect(() => {
    if (!farmer || !Array.isArray(farmers)) return;
    if (!seller || !Array.isArray(sellers)) return;

    // Find the selected farmer object
    const selectedFarmer = farmers.find((f) => f.name === farmer);
    console.log("Selected Farmer:", selectedFarmer);
    const selectedSeller = sellers?.find((s) => s.name === seller);
    console.log("Selected Seller:", selectedSeller);
    if (selectedFarmer) {
      setFarmerNumber(selectedFarmer.phoneNumber || "");
      setGender(selectedFarmer.gender || "");
      setFarmerId(selectedFarmer._id || "");
      setFarmerAge(selectedFarmer.age?.toString() || "");
    }
    if (selectedSeller) {
      setSellerId(selectedSeller._id || "");
    }
  }, [farmer, farmers, seller, sellers]);

  const bagOptions = [
    { id: "1", label: "50Kg bag", value: "50kg" },
    { id: "2", label: "90Kg bag", value: "90kg" },
  ];
  return (
    <>
      {visible &&
        (currentStep === 1 ||
          currentStep === 2 ||
          currentStep === 3 ||
          currentStep === 4) && (
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
                <div className="mb-8">
                  <Title text="Buy Stock" weight="bold" level={4} />
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
                        <X size={11} color="#343A46" />
                      </button>
                    </div>

                    <div className="mb-5">
                      <Title text="Stock Details" level={5} weight="semibold" />
                    </div>

                    <div className="flex flex-col gap-6 text-black">
                      <div className="flex flex-col gap-3 ">
                        <label htmlFor="amount" className="text-black">
                          What stock of grain are you buying?{" "}
                        </label>
                        <SelectInput
                          placeholder="Select grain"
                          name="graintype"
                          options={grainOptions}
                          value={grainType}
                          onChange={(val) => {
                            setGrainType(val);
                            setErrors((prev) => ({
                              ...prev,
                              grainType: "",
                            }));
                          }}
                          showBackground={false}
                        />

                        {errors.grainType && (
                          <span className="text-sm text-red-500">
                            {errors.grainType}
                          </span>
                        )}
                      </div>

                      <div className="z-40 flex flex-col gap-3">
                        <label>Who are you buying from?</label>
                        {/* <SmartSelectInput
                          value={seller}
                          onChange={(val) => {
                            setSeller(val);
                            const selectedSeller = sellers?.find(
                              (f) => f.name === val
                            );
                            setSellerId(selectedSeller?._id || "");
                            setErrors((prev) => ({
                              seller: "",
                            }));
                          }}
                          initialOptions={
                            sellers ? sellers?.map((seller) => seller.name) : []
                          }
                          placeholder="Select a Seller"
                          // label=""
                        /> */}
                        <SelectInput
                          placeholder="Select grain"
                          name="graintype"
                          options={sellerOptions}
                          value={seller}
                          onChange={(val) => {
                            setSeller(val);
                            setErrors((prev) => ({
                              ...prev,
                              seller: "",
                            }));
                          }}
                          showBackground={false}
                        />
                        {errors.seller && (
                          <span className="text-sm text-red-500">
                            {errors.seller}
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
                        className="absolute right-9 top-5 rounded-full border border-[#D6D8DA] p-1.5 transition hover:bg-gray-100"
                      >
                        <X size={11} color="#343A46" />
                      </button>
                    </div>

                    <div className="mb-5">
                      <Title
                        text="Farmer Details"
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
                          Select farmer
                        </label>
                        <SmartSelectInput
                          value={farmer}
                          onChange={(val) => {
                            setFarmer(val);
                            const selectedFarmer = farmers?.find(
                              (f) => f.name === val
                            );
                            setFarmerId(selectedFarmer?._id || "");
                            setErrors((prev) => ({
                              ...prev,
                              farmer: "",
                            }));
                          }}
                          initialOptions={
                            farmers ? farmers?.map((farmer) => farmer.name) : []
                          }
                          placeholder="Select a Farmer"
                          label=""
                        />
                        {errors.farmer && (
                          <span className="text-sm text-red-500">
                            {errors.farmer}
                          </span>
                        )}
                      </div>

                      <div className="z-40 flex flex-col gap-3">
                        <PhoneInput
                          value={farmerNumber}
                          onChange={(val) => {
                            setFarmerNumber(val);
                            setErrors((prev) => ({
                              ...prev,
                              farmerNumber: "",
                            }));
                          }}
                        />
                        {errors.farmerNumber && (
                          <span className="text-sm text-red-500">
                            {errors.farmerNumber}
                          </span>
                        )}
                      </div>

                      <div className="z-40 flex flex-col gap-3">
                        <label htmlFor="gender">Gender</label>
                        <RadioInput
                          options={genderOptions}
                          value={gender}
                          name="gender"
                          onChange={(val) => {
                            setGender(val);
                            setErrors((prev) => ({ ...prev, gender: "" }));
                          }}
                        />
                        {errors.gender && (
                          <span className="text-sm text-red-500">
                            {errors.gender}
                          </span>
                        )}
                      </div>

                      <div className="z-40 flex flex-col gap-3 -mt-3">
                        <label htmlFor="age">Age</label>
                        <input
                          className="h-12 max-w-[572px] rounded-lg border border-[#5D616B] text-black p-5 text-[14px] font-medium outline-none"
                          id="age"
                          type="text"
                          required
                          value={farmerAge}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setFarmerAge(value);
                            setErrors((prev) => ({ ...prev, farmerAge: "" }));
                          }}
                          placeholder="eg. 24"
                        />
                        {errors.farmerAge && (
                          <span className="text-sm text-red-500">
                            {errors.farmerAge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex justify-end gap-3 pt-10">
                      <Button
                        className="border border-[#080808] bg-white px-[60px] py-4 text-black hover:bg-white cursor-pointer"
                        onClick={handleBack}
                      >
                        Back
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
                          htmlFor="thirdPartyPayment"
                          className="text-[#080808] font-normal text-sm"
                        >
                          Paying to third party account?
                        </label>
                        <RadioInput
                          options={answerOptions}
                          value={answer}
                          name="thirdPartyPayment"
                          onChange={(val) => {
                            setAnswer(val);
                            setErrors((prev) => ({ ...prev, answer: "" }));
                          }}
                        />
                        {errors.answer && (
                          <span className="text-sm text-red-500">
                            {errors.answer}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 ">
                        <MobileMoneyInput
                          value={answer === "Yes" ? phone : farmerNumber}
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
                        {errors.phone && (
                          <span className="text-sm text-red-500">
                            {errors.phone}
                          </span>
                        )}
                        {errors.provider && (
                          <span className="text-sm text-red-500">
                            {errors.provider}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="quantityMeasurement" className="mb-2">
                          Quantity measurement
                        </label>
                        <RadioInput
                          name="quantityMeasurement"
                          options={quantityOptions}
                          value={measurement}
                          onChange={(val) => {
                            setMeasurement(val);
                            setErrors((prev) => ({
                              ...prev,
                              measurement: "",
                            }));
                          }}
                        />
                        {errors.measurement && (
                          <span className="text-sm text-red-500">
                            {errors.measurement}
                          </span>
                        )}
                      </div>

                      <div>
                        <FloatingLabelInput
                          label={
                            measurement === "BAG"
                              ? "Enter number of bags"
                              : "Enter quantity"
                          }
                          name="quantity"
                          value={quantity}
                          onChange={(e) => {
                            setQuantity(e.target.value);
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

                      {measurement === "BAG" && (
                        <div>
                          <NormalSelect
                            // label="Select bag size"
                            name="bags"
                            placeholder="Select bag size"
                            options={bagOptions}
                            value={bagSize}
                            onChange={setBagSize}
                          />
                          {/* <FloatingLabelInput
                          label={
                            measurement === "BAG"
                              ? "Enter number of bags"
                              : "Enter quantity"
                          }
                          name="bags"
                          value={bagSize}
                          onChange={(e) => {
                            setBagSize(e.target.value);
                            setErrors((prev) => ({ ...prev, quantity: "" }));
                          }}
                          className="h-12 max-w-[572px]"
                        /> */}
                          {errors.quantity && (
                            <span className="text-sm text-red-500">
                              {errors.quantity}
                            </span>
                          )}
                        </div>
                      )}
                      <div>
                        <FloatingLabelInput
                          label={
                            measurement === "KG"
                              ? "Price per kilogram"
                              : "Price per bag"
                          }
                          name="price"
                          value={price}
                          onChange={(e) => {
                            setPrice(e.target.value);
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
                    </div>

                    <div className="mt-auto flex justify-end gap-3 pt-10">
                      <Button
                        className="border border-[#080808] bg-white px-[60px] py-4 text-black hover:bg-white cursor-pointer"
                        onClick={handleBack}
                      >
                        Back
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

                {currentStep === 4 && (
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
                      <div className="relative w-full rounded-xl bg-white shadow-xl py-6 px-10">
                        <h1 className="text-[16px] font-bold text-[#343A46] mb-2">
                          Summary
                        </h1>
                        <BuytockConfirmationDetails details={details} />
                        {/* / */}
                        {/* to */}
                        <div className="mb-4">
                          <h1 className="text-sm text-[#858990] font-medium mb-2 ">
                            Farmer's details
                          </h1>
                          <div className="border border-[#8796A94D] p-2 flex items-center rounded-[10px] gap-10">
                            <div className="flex items-center gap-2">
                              <div className="bg-black rounded-full p-2 w-12 h-12 flex items-center justify-center">
                                <img src="../img/male.png" alt="" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-[#343A46] font-bold">
                                  {farmer}
                                </span>
                                <span className="text-[10px] text-[#343A46] font-normal">
                                  {farmerAge} years
                                </span>
                              </div>
                            </div>
                            {/*  */}
                            <div className="bg-[#F2F2F2] font-medium max-w-[102px] h-6 p-1 text-[#343A46] rounded-[10px] text-xs">
                              {answer === "Yes" ? phone : farmerNumber}
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

                    <div className="absolute bottom-36 flex items-center gap-2">
                      <CheckBox
                        checked={checked}
                        onChange={() => setChecked(!checked)}
                      />
                      <p className="text-[#343A46] text-xs font-normal">
                        Move to my storehouse after payment
                      </p>
                    </div>

                    {/* Buttons below the tear */}
                    <div className="flex justify-end gap-3 pt-10 mt-auto">
                      <Button
                        className="bg-white text-black w-[143px] h-12 border border-[#080808]"
                        onClick={handleBack}
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
      {visible && currentStep === 5 && (
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

      {visible && currentStep === 6 && (
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
              subtext="Your grain purchase request has been made successfully. Notification has been sent to the Paymaster for processing."
              header="Purchase request successfully sent for approval"
              buttonText="Sell Again"
              onClose={onClose}
              onSubmit={handleSubmit}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default BuyStockModal;
