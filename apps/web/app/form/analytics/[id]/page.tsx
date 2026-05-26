"use client";

import { use } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Clock,
  BarChart2,
  Globe,
  Link2,
  Filter,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { containerVariants, itemVariants } from "@/components/analytics/constants";
import { StatCard } from "@/components/analytics/stat-card";
import { FieldChartCard } from "@/components/analytics/field-chart-card";
import { ShareSection } from "@/components/analytics/share-section";
import { CsvExportSection } from "@/components/analytics/csv-export-section";
import { ResponseTableSection } from "@/components/analytics/response-table-section";
import { trpc } from "@/trpc/client";



export default function FormAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  
  const { data, isLoading, error } = trpc.form.getAnalyticsForSpecificForm.useQuery({ formId: id });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Failed to load analytics</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const { form, fields, trendData } = data;

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(226,255,50,0.05),transparent)]" />

      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-7"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Button
            id="back-btn"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground mb-5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-xs gap-1 border-none ${
                    form.visibility === "public"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : form.visibility === "unlisted"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-zinc-500/10 text-zinc-400"
                  }`}
                >
                  {form.visibility === "public" ? (
                    <>
                      <Globe className="h-3 w-3" /> Public
                    </>
                  ) : form.visibility === "unlisted" ? (
                    <>
                      <Link2 className="h-3 w-3" /> Unlisted
                    </>
                  ) : (
                    "Draft"
                  )}
                </Badge>
                {form.isPublished && (
                  <Badge
                    variant="outline"
                    className="text-xs border-none bg-primary/10 text-primary gap-1"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse inline-block" />
                    Live
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {form.description}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Created{" "}
                {new Date(form.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" · "}
                {form.responseLimit
                  ? `${form.totalResponses} of ${form.responseLimit} responses used`
                  : `${form.totalResponses} total responses`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                id="preview-form-btn"
                variant="outline"
                size="sm"
                className="gap-1.5 border-border"
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </Button>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Responses"
            value={form.totalResponses}
            sub={
              form.responseLimit
                ? `of ${form.responseLimit} limit`
                : "no limit set"
            }
            accent
          />
          <StatCard
            icon={TrendingUp}
            label="Completion Rate"
            value={`100%`}
            sub="avg across all fields"
          />
          <StatCard
            icon={BarChart2}
            label="Avg / Day"
            value={form.avgResponsesPerDay}
            sub="responses per day"
          />
          <StatCard
            icon={Clock}
            label="Last Response"
            value={form.lastResponseAt ? "Recent" : "None"}
            sub={form.lastResponseAt ? new Date(form.lastResponseAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }) : "No responses yet"}
          />
        </div>
        <motion.div variants={itemVariants}>
          <Card className="border-border bg-card">
            <CardHeader className="pb-1">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Response Trend</CardTitle>
                  <CardDescription>
                    Daily submissions over the last 30 days
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground text-xs"
                >
                  Last 30 days
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart
                  data={trendData}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="trendGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#E2FF32"
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="100%"
                        stopColor="#E2FF32"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272A"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
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
                    content={({ active, payload, label }) => {
                      if (active && payload?.length && payload[0]) {
                        return (
                          <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-xl">
                            <p className="text-xs text-muted-foreground">
                              {label}
                            </p>
                            <p className="text-sm font-bold text-primary">
                              {payload[0].value} responses
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="responses"
                    stroke="#E2FF32"
                    strokeWidth={2}
                    fill="url(#trendGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#E2FF32",
                      stroke: "#0A0A0B",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <div>
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-5"
          >
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Field Analytics
              </h2>
              <p className="text-sm text-muted-foreground">
                {fields.length} fields · individual response breakdown
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border text-muted-foreground"
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {fields.map((field) => (
              <FieldChartCard key={field.id} field={field as any} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <ResponseTableSection formId={form.id} totalResponses={form.totalResponses} />
          <ShareSection form={form as any} />
        </div>
        <CsvExportSection form={{ id: form.id, totalResponses: form.totalResponses }} fields={fields.map(f => ({ id: f.id, label: f.label, type: f.type as import("@/components/analytics/types").FieldType }))} />
        <div className="h-6" />
      </motion.div>
    </div>
  );
}