"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Hash, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/trpc/client";

const fieldTypeLabel: Record<string, string> = {
  short_text:    "Short Text",
  long_text:     "Long Text",
  email:         "Email",
  number:        "Number",
  single_select: "Single Select",
  multi_select:  "Multi Select",
  checkbox:      "Checkbox",
  rating:        "Rating",
  date:          "Date",
};

function AnswerCard({ label, type, value }: { label: string; type: string; value: string }) {
  const isEmpty = !value || value.trim() === "";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm font-medium text-foreground leading-snug">{label}</p>
        <span className="shrink-0 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-full">
          {fieldTypeLabel[type] ?? type}
        </span>
      </div>
      {isEmpty ? (
        <p className="text-sm text-muted-foreground italic">— no answer —</p>
      ) : type === "rating" ? (
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 20 20"
              className={`w-5 h-5 ${i < Number(value) ? "text-primary fill-primary" : "text-muted-foreground/30 fill-muted-foreground/30"}`}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-sm text-muted-foreground">{value} / 5</span>
        </div>
      ) : (
        <p className="text-sm text-foreground whitespace-pre-wrap break-words">{value}</p>
      )}
    </motion.div>
  );
}

export default function ResponseDetailPage({
  params,
}: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  const { id: formId, responseId } = use(params);
  const router = useRouter();

  const { data, isLoading, error } = trpc.form.getResponseById.useQuery({ formId, responseId });

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(226,255,50,0.05),transparent)]" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to analytics
        </Button>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-destructive">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm">Could not load this response.</p>
          </div>
        )}

        {data && (
          <>
            {/* Header card */}
            <Card className="border-border bg-card mb-6">
              <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Response ID
                  </p>
                  <p className="font-mono text-sm text-primary font-bold break-all">
                    {data.response.id}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(data.response.submittedAt).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-sm">
                  <Hash className="w-4 h-4" />
                  {data.items.length} {data.items.length === 1 ? "answer" : "answers"}
                </div>
              </CardContent>
            </Card>

            {/* Answers */}
            {data.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
                <p className="text-sm">No answers recorded for this response.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.items.map((item, i) => (
                  <motion.div
                    key={item.fieldId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <AnswerCard
                      label={item.fieldLabel}
                      type={item.fieldType}
                      value={item.value}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
