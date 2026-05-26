"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { itemVariants } from "./constants";

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Card className="border-border bg-card relative overflow-hidden h-full">
        {accent && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        )}
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                {label}
              </p>
              <p className="mt-1.5 text-3xl font-bold text-foreground tabular-nums">
                {value}
              </p>
              {sub && (
                <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
              )}
            </div>
            <div
              className={`shrink-0 rounded-xl p-2.5 ${
                accent ? "bg-primary/15" : "bg-secondary"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  accent ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
