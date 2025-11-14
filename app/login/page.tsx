"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AuthCredentialsForm } from "@/components/forms/auth-credentials-form";
import { AuthOtpForm } from "@/components/forms/auth-otp-form";
import { AuthStep } from "@/types/index";
import { When } from "react-if";
import logo from "@/public/img/saving_grains_logo_dark.png";
import Title from "@/components/title";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>(AuthStep.Credentials);
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="flex h-screen bg-white pb-[174px]">
      <div className="m-auto w-full max-w-[520px]">
        <div className="flex flex-col space-y-12 rounded-xl p-12">
          <AuthCredentialsForm setStep={setStep} />
        </div>
      </div>
    </div>
  );
}
