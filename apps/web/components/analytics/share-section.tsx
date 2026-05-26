"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Copy, Check, Download, Share2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { itemVariants } from "./constants";

export function ShareSection({ form }:any) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const formUrl = `${origin}/form/submit/${form.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formUrl).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(formUrl)}&color=e2ff32&bgcolor=121214&margin=10&qzone=1`;

  return (
    <motion.div variants={itemVariants} className="h-full flex flex-col">
      <Card className="border-border bg-card overflow-hidden h-full flex flex-col">
        {/* Header */}
        <CardHeader className="border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="rounded-xl p-2.5 bg-primary/10">
              <Share2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Share Your Form</CardTitle>
              <CardDescription>
                Copy the link or scan the QR code to share with respondents
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Content: fills remaining height and centers the two-column layout */}
        <CardContent className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-lg">

            {/* QR Code column */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                QR Code
              </p>
              <div className="relative rounded-2xl border border-border bg-[#121214] p-3 shadow-2xl">
                <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt="QR code for form link"
                  width={140}
                  height={140}
                  className="relative rounded-lg block"
                />
              </div>
              <Button
                id="download-qr-btn"
                variant="outline"
                size="sm"
                className="gap-1.5 border-border w-full"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
            <div className="hidden sm:block w-px self-stretch bg-border/50" />
            <div className="block sm:hidden w-full h-px bg-border/50" />
            <div className="flex flex-col gap-4 w-full sm:flex-1 sm:max-w-[240px]">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                  Share via Link
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Copy this link and share it anywhere.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 overflow-hidden">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-foreground font-mono truncate">
                  {formUrl}
                </span>
              </div>

              <Button
                onClick={handleCopy}
                id="copy-form-url-btn"
                size="sm"
                className={`w-full gap-1.5 transition-all duration-300 ${copied
                    ? "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/15"
                    : "bg-primary text-primary-foreground hover:bg-primary/85"
                  }`}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      className="flex items-center gap-1.5"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy Link
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
