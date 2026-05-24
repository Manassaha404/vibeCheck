"use client";

import { use } from "react";
import { FormBuilderClient } from "@/components/form-builder/form-builder-client";
import { trpc } from "@/trpc/client";
import PageLoader from "@/components/PageLoader";

export default function DraftFormPage({params}: {params: Promise<{id:string}>}) {
  const { id } = use(params);
  const { data, isLoading, isError } = trpc.form.getFormById.useQuery({ id }, {
    enabled: !!id,
  });
  if (isLoading || !id) {
    return <PageLoader />;
  }

  if (isError || !data?.form) {
    return <div className="p-8 text-center text-destructive">Failed to load draft form.</div>;
  }

  return <FormBuilderClient initialData={data.form as any} />;
}