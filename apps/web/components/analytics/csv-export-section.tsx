"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { itemVariants } from "./constants";
import { FieldTypeIcon } from "./field-type-icon";
import type { FieldType } from "./types";
import { trpc } from "@/trpc/client";
import Papa from "papaparse";

interface CsvExportSectionProps {
  form: {
    id: string;
    totalResponses: number;
  };
  fields: {
    id: string;
    label: string;
    type: FieldType;
  }[];
}

export function CsvExportSection({ form, fields }: CsvExportSectionProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>(
    fields.map((f) => f.id)
  );
  const [dateRange, setDateRange] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const toggleField = (id: string) => {
    setSelectedFields((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const allSelected = selectedFields.length === fields.length;

  const dateOptions = [
    { value: "all", label: "All time" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "custom", label: "Custom range" },
  ];

  const estimatedSize = Math.round(
    (form.totalResponses * selectedFields.length * 0.022)
  );

  const getDateFilters = () => {
    const now = new Date();
    if (dateRange === "7d") {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    if (dateRange === "30d") {
      const start = new Date(now);
      start.setDate(start.getDate() - 30);
      return { startDate: start.toISOString(), endDate: now.toISOString() };
    }
    if (dateRange === "custom") {
      return {
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate + "T23:59:59").toISOString() : undefined,
      };
    }
    return { startDate: undefined, endDate: undefined };
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const dateFilters = getDateFilters();
      const result = await utils.form.getFormResponsesForExport.fetch({
        formId: form.id,
        fieldIds: selectedFields.length === fields.length ? undefined : selectedFields,
        ...dateFilters,
      });

      if (!result || result.rows.length === 0) {
        setExportError("No responses found for the selected filters.");
        setIsExporting(false);
        return;
      }

      const csv = Papa.unparse(result.rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const formTitle = document.title || "form";
      const timestamp = new Date().toISOString().slice(0, 10);
      link.setAttribute("download", `${formTitle.replace(/\s+/g, "_")}_responses_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setExportError(err?.message ?? "Failed to export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-xl p-2.5 bg-primary/10">
              <FileDown className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Export Response Data</CardTitle>
              <CardDescription>
                Download all responses as a structured CSV file
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Date Range
              </label>
              <div className="space-y-2">
                {dateOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 cursor-pointer transition-all duration-200 ${
                      dateRange === opt.value
                        ? "border-primary/40 bg-primary/8"
                        : "border-border bg-secondary/20 hover:bg-secondary/50 hover:border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="dateRange"
                      value={opt.value}
                      checked={dateRange === opt.value}
                      onChange={() => setDateRange(opt.value)}
                      className="accent-primary h-3.5 w-3.5"
                    />
                    <span
                      className={`text-sm ${
                        dateRange === opt.value
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {opt.label}
                    </span>
                    {opt.value === "all" && (
                      <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                        {form.totalResponses} rows
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <AnimatePresence>
                {dateRange === "custom" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/10">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-transparent border-b border-border/50 pb-1 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-transparent border-b border-border/50 pb-1 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Field Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Include Fields ({selectedFields.length}/{fields.length})
                </label>
                <button
                  onClick={() =>
                    setSelectedFields(
                      allSelected ? [] : fields.map((f) => f.id)
                    )
                  }
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar pr-0.5">
                {fields.map((field) => {
                  const isSelected = selectedFields.includes(field.id);
                  return (
                    <label
                      key={field.id}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-primary/30 bg-primary/6"
                          : "border-border bg-secondary/20 hover:bg-secondary/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleField(field.id)}
                        className="accent-primary h-3.5 w-3.5 shrink-0"
                      />
                      <FieldTypeIcon type={field.type} />
                      <span className="text-xs text-foreground truncate flex-1">
                        {field.label}
                      </span>
                      {isSelected && (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <AnimatePresence>
            {exportError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
              >
                <span className="flex-1">{exportError}</span>
                <button
                  onClick={() => setExportError(null)}
                  className="shrink-0 opacity-60 hover:opacity-100 text-xs font-medium"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            layout
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/8 to-primary/4 px-5 py-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {form.totalResponses} responses ×{" "}
                {selectedFields.length} fields
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {estimatedSize > 0
                  ? `Estimated file size: ~${estimatedSize} KB · CSV format`
                  : "Select at least one field to export"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                id="download-csv-btn"
                size="sm"
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/85 font-semibold"
                disabled={selectedFields.length === 0 || isExporting || form.totalResponses === 0}
                onClick={handleExport}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export CSV
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
