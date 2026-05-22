// components/otp-success-card.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function OTPSuccessCard() {
  return (
    <motion.div
      key="success-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full max-w-sm text-center"
    >
      <Card className="border-border shadow-sm p-6 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary"
        >
          <CheckCircle2 className="h-6 w-6" />
        </motion.div>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Verification Successful
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account security is configured. Redirecting you to your dashboard...
        </p>
      </Card>
    </motion.div>
  );
}