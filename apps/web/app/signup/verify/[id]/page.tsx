"use client";

import React, { useState, use } from "react";
import { AnimatePresence } from "framer-motion";
import { OTPDisplayCard } from "@/components/signup/otp-display-card";
import { OTPSuccessCard } from "@/components/signup/otp-success-card";
import { trpc } from "@/trpc/client";

import { useRouter } from "next/navigation"; 

export default function OTPVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); 
  const router = useRouter();
  
  const [otp, setOtp] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { mutate } = trpc.auth.verifyEmail.useMutation({
    onMutate: () => {
      setStatus("submitting");
    },
    onSuccess: () => {
      setStatus("success");
      setTimeout(() => {
        router.replace('/');
      }, 2000);
    },
    onError: (err) => {
      setStatus("error");
      setErrorMessage("The code you entered is invalid. Please try again.");
    },
  });

  const handleVerify = (otpValue: string) => {
    mutate({ id, otp: otpValue });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <AnimatePresence mode="wait">
        {status !== "success" ? (
          <OTPDisplayCard
            key="display-card-wrapper"
            otp={otp}
            setOtp={setOtp}
            status={status}
            setStatus={(newStatus: "idle" | "submitting" | "error") =>
              setStatus(newStatus)
            }
            errorMessage={errorMessage}
            onVerify={handleVerify}
          />
        ) : (
          <OTPSuccessCard key="success-card-wrapper" />
        )}
      </AnimatePresence>
    </div>
  );
}