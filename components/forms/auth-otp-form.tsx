"use client";

import { FormEvent, useState } from "react";
import OTPInput from "@/components/forms/otp-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthStep } from "@/types";
import { useRouter } from "next/navigation";

interface Props {
  setStep: (step: AuthStep) => void;
}

export function AuthOtpForm({ setStep }: Props) {
  const [otp, setOtp] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true);
    setError("");

    try {
      // get token or phone from localStorage/cookie (depending on how your backend expects it)
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const res = await fetch("http://localhost:3000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      // ✅ OTP verified — redirect user
      router.push("/overview");
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      setError(err.message || "Verification failed");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col space-y-5">
      <div className="text-center">
        <h4 className="text-xl font-semibold">Enter OTP</h4>
        <p className="text-gray-500 text-sm mt-1">
          Check your phone for a 6-digit code
        </p>
      </div>

      <OTPInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        shouldAutoFocus
        renderInput={(props) => (
          <Input {...props} className="h-16 w-14 text-2xl text-center" />
        )}
        containerStyle="grid grid-cols-6 gap-2 justify-center"
      />

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button type="submit" block disabled={processing || otp.length < 6}>
        {processing ? "Verifying..." : "Continue"}
      </Button>
    </form>
  );
}
