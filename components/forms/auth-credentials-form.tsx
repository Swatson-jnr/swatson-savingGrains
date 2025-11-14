"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthStep } from "@/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import apiClient from "@/lib/axios";
import { CountryPhoneInput } from "../country-phone-number";
import OTPInput from "./otp-input";
import logo from "@/public/img/saving_grains_logo_dark.png";
import { ArrowLeft } from "lucide-react";
import { PhoneStep } from "./phone-step";
import { PinStep } from "./pin-step";
import Link from "next/link";

interface Props {
  setStep: (step: AuthStep) => void;
}

export function AuthCredentialsForm({ setStep }: Props) {
  const [phone_number, setPhone_Number] = useState("");
  const [passcode, setPasscode] = useState("");
  const [phone, setPhone] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [visible, setVisible] = useState<boolean>(true);

  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const providers = [
    { value: "+233", label: "+233", image: "../img/ghana.png" },
    { value: "+254", label: "+254", image: "../img/kenya.png" },
  ];
  const [provider, setProvider] = useState(providers[0].value);

  const handleContinue = () => {
    if (!phone || !provider) {
      setErrors({ phone: "Please enter a valid phone number" });
      return;
    }

    setPhone_Number(`${provider}${phone}`); // store full number
    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 2));
    setVisible(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      //Use apiClient.post directly with data object
      const res = await apiClient.post("auth/login", {
        phone_number,
        passcode,
      });
      // const res = await axios.post("http://localhost:3001/api/auth/login", {
      //   phone_number,
      //   passcode,
      // });
      const data = res.data; // Axios automatically parses JSON

      // Check for HTTP errors (optional, Axios throws on 4xx/5xx by default)
      if (!res.status || res.status >= 400) {
        throw new Error(data.error || "Login failed");
      }

      const accessToken = data.tokens?.access;
      const refreshToken = data.tokens?.refresh;
      const user = data.user;

      console.log("Logged in user:", user);

      //Store tokens
      if (accessToken) {
        document.cookie = `token=${accessToken}; path=/; max-age=604800`; // 7 days
        localStorage.setItem("access_token", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      //Store the user object and roles
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.roles); // e.g., "admin" or "admin,paymaster"
      }

      //Navigate based on OTP
      if (!user?.otp || user?.otp === "null") {
        router.push("/overview");
      } else {
        setStep(AuthStep.OTPVerification);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      const fail = err.response.data.error;
      setErrors({
        reason: fail || "Something went wrong",
      });
    } finally {
      setProcessing(false);
    }
  };

  const failed = "Failed to Sign In";
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      {currentStep === 2 && (
        <button
          className="absolute top-8 left-20 text-black flex gap-2 cursor-pointer"
          onClick={() => {
            setCurrentStep(1);
            setVisible(true);
          }}
        >
          <ArrowLeft />
          <h1>Back</h1>
        </button>
      )}
      {visible && (
        // <>
        //   <div className="flex items-center justify-center mb-[30px]">
        //     <img src={logo.src} alt="Logo" width={120} />
        //   </div>

        //   <div className="flex items-center justify-center mb-10 flex-col">
        //     {/* <Title text="Welcome Back" level={3} weight="normal" /> */}
        //     <h1 className="text-black font-semibold text-[24px]">
        //       Welcome Back
        //     </h1>
        //     <p className="text-[14px] font-normal text-[#858990]">
        //       Kindly enter your phone number to continue
        //     </p>
        //   </div>
        //   <div className="flex flex-col space-y-3">
        //     <label
        //       htmlFor="Phone Number"
        //       className="text-sm font-normal text-[#384048] mb-[9px]"
        //     >
        //       Phone Number
        //     </label>

        //     <CountryPhoneInput
        //       value={phone}
        //       onChange={(val) => {
        //         setPhone(val);
        //         setErrors((prev) => ({
        //           ...prev,
        //           phone: "",
        //         }));
        //       }}
        //       provider={provider}
        //       onProviderChange={(val) => {
        //         setProvider(val);
        //         setErrors((prev) => ({
        //           ...prev,
        //           provider: "",
        //         }));
        //       }}
        //       providers={providers}
        //     />
        //   </div>

        //   {errors.phone && (
        //     <span className="text-sm text-red-500">{errors.phone}</span>
        //   )}

        //   <Button
        //     type="button"
        //     onClick={handleContinue}
        //     block
        //     disabled={processing}
        //     className="h-[50px] font-semibold text-white text-[14px]"
        //   >
        //     {processing ? "Processing..." : "Continue"}
        //   </Button>
        <PhoneStep
          phone={phone}
          provider={provider}
          processing={processing}
          errors={errors}
          providers={providers}
          onPhoneChange={(val) => {
            setPhone(val);
            setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          onProviderChange={(val) => {
            setProvider(val);
            setErrors((prev) => ({ ...prev, provider: "" }));
          }}
          onContinue={handleContinue}
        />
      )}

      {/* ............otp.......... */}
      {currentStep === 2 && (
        // <>
        //   <div className="flex flex-col items-center justify-center">
        //     <div className="text-center mb-10">
        //       <h4 className="text-3xl font-semibold text-black mb-2.5">
        //         Enter your PIN
        //       </h4>
        //       <h4 className="text-[16px] font-normal text-[#858990] ml-1">
        //         Enter your 4-Digit PIN Code{" "}
        //       </h4>
        //       {/* <p className="text-gray-500 text-sm mt-1">Forgot your PIN? </p> */}
        //     </div>

        //     <div className="flex items-center justify-center mb-[30px]">
        //       <OTPInput
        //         value={passcode}
        //         onChange={setPasscode}
        //         numInputs={4}
        //         shouldAutoFocus
        //         renderInput={(props) => (
        //           <Input
        //             {...props}
        //             className="h-[46px] w-[46px] text-2xl text-center"
        //           />
        //         )}
        //         containerStyle="grid grid-cols-4 gap-2 justify-center place-items-center"
        //       />
        //     </div>
        //   </div>

        //   {errors.reason && (
        //     <span className="text-sm text-red-500">{errors.reason}</span>
        //   )}

        //   <div className="text-center">
        //     <p className="text-[#343A46] text-[16px] font-semibold underline pb-1 mt-1">
        //       Forgot your PIN?{" "}
        //     </p>
        //   </div>

        //   <Button
        //     type="submit"
        //     block
        //     disabled={processing || passcode.length > 4}
        //     className="w-[360px] h-[50px] text-center"
        //   >
        //     {processing ? "Verifying..." : "Continue"}
        //   </Button>
        // </>

        <PinStep
          phone={phone}
          passcode={passcode}
          processing={processing}
          errors={errors}
          onPasscodeChange={setPasscode}
          onSubmit={() => handleSubmit}
        />
      )}
    </form>
  );
}
