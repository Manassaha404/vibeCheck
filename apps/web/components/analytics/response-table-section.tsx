"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, ArrowLeft, ArrowRight, Inbox, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { itemVariants } from "./constants";
import { trpc } from "@/trpc/client";

export function ResponseTableSection({ formId, totalResponses }: { formId: string, totalResponses: number }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = trpc.form.getFormResponses.useQuery({
    formId,
    page,
    pageSize,
  });

  const responses = data?.responses ?? [];
  const totalPages = Math.ceil(totalResponses / pageSize) || 1;

  return (
    <motion.div variants={itemVariants} className="h-full flex flex-col">
      <Card className="border-border bg-card overflow-hidden h-full flex flex-col">
        <CardHeader className="border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl p-2.5 bg-secondary">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Individual Responses</CardTitle>
                <CardDescription>
                  Click any row to view full response details
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col flex-1 min-h-0">
          <div className="overflow-auto flex-1 custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : responses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground p-6">
                <Inbox className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No responses yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-24">
                      ID
                    </th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {responses.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      onClick={() => router.push(`/form/analytics/${formId}/response/${row.id}`)}
                      className="border-b border-border/50 hover:bg-secondary/40 transition-colors duration-150 cursor-pointer group"
                    >
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-mono text-xs text-primary font-semibold">
                          {row.id.substring(0, 8)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center text-xs text-muted-foreground">
                        {new Date(row.submittedAt).toLocaleString()}
                      </td>
                      <td className="px-2 py-3.5 text-center">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors duration-150" />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-border/50 bg-secondary/10 shrink-0">
            <p className="text-xs text-muted-foreground">
              Showing {responses.length} of {totalResponses} responses
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary gap-1 px-2 h-7"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ArrowLeft className="h-3 w-3" />
                Prev
              </Button>
              <span className="text-xs text-muted-foreground mx-1">
                {page} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary gap-1 px-2 h-7"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
              >
                Next
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
