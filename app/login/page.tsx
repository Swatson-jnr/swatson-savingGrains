"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AuthCredentialsForm } from "@/components/forms/auth-credentials-form";
import { AuthOtpForm } from "@/components/forms/auth-otp-form";
import { AuthStep } from "@/types/index";
import { When } from "react-if";
import logo from "@/public/img/saving_grains_logo_dark.png";

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>(AuthStep.Credentials);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="m-auto w-full max-w-[520px]">
        <Card className="card-shadow flex flex-col space-y-12 rounded-xl p-12">
          <div className="flex items-center justify-center">
            <img
              src={logo.src}
              alt="Logo"
              width={120}
            />
          </div>

          <When condition={step === AuthStep.Credentials}>
            <AuthCredentialsForm setStep={setStep} />
          </When>

          <When condition={step === AuthStep.OTPVerification}>
            <AuthOtpForm setStep={setStep} />
          </When>
        </Card>
      </div>
    </div>
  );
}
