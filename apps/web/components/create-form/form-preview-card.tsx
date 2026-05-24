"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Users,
  Clock,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CreateFormValues } from "./types";
import { cn } from "@/lib/utils";

interface FormPreviewCardProps {
  values: CreateFormValues;
}

export function FormPreviewCard({ values }: FormPreviewCardProps) {
  return (
    <div className="sticky top-24 space-y-4">
      {/* Preview label */}
      <div className="flex items-center gap-2">
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Live Preview
        </span>
      </div>

      {/* Card preview */}
      <motion.div
        layout
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative"
      >
        <Card className="overflow-hidden border border-border/60 bg-card/80 shadow-xl shadow-black/20 backdrop-blur-sm">
          {/* Glowing top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          <CardHeader className="pb-3 pt-5">
            <div className="space-y-2">
              <motion.h3
                layout="position"
                className="text-base font-semibold leading-snug tracking-tight text-foreground"
              >
                {values.title || (
                  <span className="text-muted-foreground/40">
                    Your form title...
                  </span>
                )}
              </motion.h3>

              {values.slug && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-[11px] text-muted-foreground/60"
                >
                  /{values.slug}
                </motion.p>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pb-5">
            {/* Description preview */}
            {values.description ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {values.description}
              </p>
            ) : (
              <div className="space-y-1.5">
                <div className="h-2.5 w-full rounded-full bg-muted/40" />
                <div className="h-2.5 w-4/5 rounded-full bg-muted/40" />
              </div>
            )}

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {values.passwordNeeded && (
                <Badge
                  variant="outline"
                  className="h-6 gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 text-[10px] font-medium text-orange-400"
                >
                  <Lock className="h-3 w-3" />
                  Password protected
                </Badge>
              )}
              {values.responseLimit && (
                <Badge
                  variant="outline"
                  className="h-6 gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 text-[10px] font-medium text-blue-400"
                >
                  <Users className="h-3 w-3" />
                  {values.responseLimit} responses
                </Badge>
              )}

              {values.expiresAt && (
                <Badge
                  variant="outline"
                  className="h-6 gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 text-[10px] font-medium text-purple-400"
                >
                  <Clock className="h-3 w-3" />
                  Expires{" "}
                  {new Date(values.expiresAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Badge>
              )}

              <Badge
                variant="outline"
                className={cn(
                  "h-6 gap-1.5 rounded-full border px-2.5 text-[10px] font-medium",
                  values.allowResponseEdit
                    ? "border-green-500/20 bg-green-500/10 text-green-400"
                    : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                )}
              >
                {values.allowResponseEdit ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {values.allowResponseEdit ? "Editable" : "No edits"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next step hint */}
      <div className="rounded-xl border border-border/40 bg-muted/20 p-3.5">
        <p className="text-[11px] font-medium text-muted-foreground">
          ⚡ What happens next
        </p>
        <ul className="mt-2 space-y-1.5">
          {[
            "Save as draft to get your form ID",
            "Add fields in the form builder",
            "Then set visibility to Public or Unlisted",
          ].map((step, i) => (
            <li
              key={step}
              className="flex items-start gap-2 text-[11px] text-muted-foreground/70"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
