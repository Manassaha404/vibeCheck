"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Star, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CHART_COLORS, itemVariants } from "./constants";
import { FieldTypeIcon } from "./field-type-icon";
import { CustomTooltip, PieLabel } from "./charts";
import type { FieldAnalytics } from "./types";


export function FieldChartCard({ field }: { field: FieldAnalytics }) {


  return (
    <motion.div variants={itemVariants} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="border-border bg-card h-full flex flex-col">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                <FieldTypeIcon type={field.type} />
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4 border-border/60 text-muted-foreground capitalize"
                >
                  {field.type.replace("_", " ")}
                </Badge>
                {field.required && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-4 border-primary/30 text-primary bg-primary/5"
                  >
                    Required
                  </Badge>
                )}
              </div>
              <CardTitle className="text-sm font-semibold leading-snug text-foreground">
                {field.label}
              </CardTitle>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-foreground tabular-nums">
                {field.totalResponses}
              </p>
              <p className="text-[10px] text-muted-foreground">
                responses
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-1">
          {field.chartType === "bar" && field.chartData && (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart
                data={field.chartData}
                margin={{ top: 4, right: 0, left: -22, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272A"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(226,255,50,0.04)" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {field.chartData.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={entry.fill ?? CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {field.chartType === "pie" && field.chartData && (
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={field.chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={72}
                      innerRadius={32}
                      dataKey="value"
                      labelLine={false}
                      label={PieLabel}
                      strokeWidth={0}
                    >
                      {field.chartData.map((_, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                {field.chartData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                      <span className="text-xs text-muted-foreground truncate">
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-foreground tabular-nums shrink-0">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {field.chartType === "text" && (
            <div className="flex flex-col h-[190px]">
              <p className="mb-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                Recent Responses
              </p>
              <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pr-0.5">
                {field.recentAnswers?.map((answer, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2 rounded-md bg-secondary/60 px-3 py-2"
                  >
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-xs text-foreground leading-relaxed">
                      {answer}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {field.avgRating !== undefined && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/8 border border-primary/15 px-3 py-2">
              <Star className="h-3.5 w-3.5 text-primary fill-primary" />
              <span className="text-xs text-muted-foreground">Average rating</span>
              <span className="ml-auto text-sm font-bold text-primary tabular-nums">
                {field.avgRating} / 5
              </span>
            </div>
          )}
          {field.avg !== undefined && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/8 border border-primary/15 px-3 py-2">
              <Hash className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Average value</span>
              <span className="ml-auto text-sm font-bold text-primary tabular-nums">
                {field.avg}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
