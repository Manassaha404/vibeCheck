"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCards } from "@/components/dashboard/stat-cards";
import { FormGrid } from "@/components/dashboard/form-grid";
import { trpc } from "../../trpc/client";
import PageLoader from "@/components/PageLoader";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, isError } = trpc.form.getAllCreatedForms.useQuery();
  if (isLoading) {
    return <PageLoader />;
  }
  if (isError) {
    return (
      <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive">
        <Loader2 className="mb-2 h-6 w-6 animate-spin" />
        <p className="text-sm font-medium">
          Failed to load forms. Please refresh.
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <DashboardHeader />
        <StatCards forms={data?.forms || []}/>        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Recent Forms</h2>
          <FormGrid forms={data?.forms || []} />
        </div>
      </div>  
    </div>
  );
} 