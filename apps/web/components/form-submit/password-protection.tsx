"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { itemVariants, lockIconVariants } from "./constants";

interface PasswordProtectionProps {
  onUnlock: (password: string) => Promise<boolean>;
  formTitle: string;
}

export function PasswordProtection({ onUnlock, formTitle }: PasswordProtectionProps) {
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      triggerError();
      return;
    }
    
    setIsLoading(true);
    const success = await onUnlock(password);
    setIsLoading(false);

    if (!success) {
      triggerError();
    }
  };

  const triggerError = () => {
    setIsError(true);
    setErrorMsg("Incorrect password. Please try again.");
    setTimeout(() => setIsError(false), 500);
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-center min-h-[60vh]"
    >
      <Card className="w-full max-w-md border-border bg-card shadow-2xl relative overflow-hidden backdrop-blur-xl bg-card/60">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        <CardHeader className="text-center pb-2 pt-8">
          <motion.div 
            variants={lockIconVariants}
            animate={isError ? "shake" : "visible"}
            className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4"
          >
            <Lock className="w-8 h-8 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl font-bold tracking-tight">Protected Form</CardTitle>
          <CardDescription className="text-sm mt-2">
            "{formTitle}" requires a password to view and submit.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 relative">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                disabled={isLoading}
                className={`h-12 bg-secondary/50 border-border ${isError || errorMsg ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                autoFocus
              />
              <AnimatePresence>
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }} 
                    animate={{ opacity: 1, height: "auto", y: 0 }} 
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="flex items-center gap-1.5 text-destructive text-sm mt-2 ml-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <p>{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="pt-2">
              <Button type="submit" disabled={isLoading} className="w-full h-12 text-md gap-2 group transition-all duration-300">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Unlock Form
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
