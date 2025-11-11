"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthStep } from "@/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import apiClient from "@/lib/axios";

interface Props {
  setStep: (step: AuthStep) => void;
}

export function AuthCredentialsForm({ setStep }: Props) {
  const [phone_number, setPhone] = useState("");
  const [passcode, setPasscode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true);
    setError("");

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
      setError(err.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  }
  return (
    <form onSubmit={submit} className="flex flex-col space-y-5">
      <div className="flex flex-col space-y-3">
        <Input
          placeholder="Phone number"
          value={phone_number}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          placeholder="Passcode"
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button type="submit" block disabled={processing}>
        {processing ? "Processing..." : "Continue"}
      </Button>
    </form>
  );
}
