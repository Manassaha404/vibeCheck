// components/otp-display-card.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPDisplayCardProps {
  otp: string;
  setOtp: (value: string) => void;
  status: "idle" | "submitting" | "error";
  setStatus: (status: "idle" | "submitting" | "error") => void;
  errorMessage: string;
  onVerify: (otpValue: string) => void;
}

export function OTPDisplayCard({
  otp,
  setOtp,
  status,
  setStatus,
  errorMessage,
  onVerify,
}: OTPDisplayCardProps) {
  return (
    <motion.div
      key="verify-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full max-w-md"
    >
      <Card className="border-border shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => console.log("Back clicked")}
              disabled={status === "submitting"}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight mt-2 text-foreground">
            Verify your account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We've sent a 6-digit verification code to your email address.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center py-6">
          <form onSubmit={(e) => { e.preventDefault(); if (otp.length === 6) onVerify(otp); }}>
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  if (status === "error") setStatus("idle");
                }}
                onComplete={onVerify}
                disabled={status === "submitting"}
              >
                <InputOTPGroup className="gap-2">
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`h-12 w-10 sm:h-14 sm:w-12 text-lg font-medium transition-all duration-200 rounded-md border
                        ${status === "error" 
                          ? "border-destructive bg-destructive/10 text-destructive focus-visible:ring-destructive" 
                          : "border-input focus-visible:ring-ring"
                        }`}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs font-medium text-destructive sm:text-sm"
                  >
                    {errorMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full relative transition-all duration-200 font-medium"
            disabled={otp.length !== 6 || status === "submitting"}
            onClick={() => onVerify(otp)}
          >
            <span className={status === "submitting" ? "opacity-0" : "opacity-100"}>
              Verify Code
            </span>
            {status === "submitting" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              type="button"
              className="font-medium text-foreground hover:underline disabled:opacity-50"
              disabled={status === "submitting"}
              onClick={() => {
                setOtp("");
                setStatus("idle");
                console.log("Resending OTP...");
              }}
            >
              Resend Code
            </button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}