"use client";
import {trpc} from "@/trpc/client"
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { FormPageHeader } from "./form-page-header";
import { FormBasicsSection } from "./form-basics-section";
import { FormSettingsSection } from "./form-settings-section";
import { FormPreviewCard } from "./form-preview-card";
import {
  createFormSchema,
  defaultValues,
  type CreateFormValues,
} from "./types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
} as const;

export function CreateFormClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createFormMutation = trpc.form.createForm.useMutation();

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    formState: { isDirty },
    handleSubmit,
    watch,
    reset,
    getValues,
  } = form;

  const values = watch();

  // Save as draft — always sets visibility: "draft"
  const handleSaveDraft = useCallback(
    handleSubmit(async (data) => {
      const payload = {
        ...data,
        expiresAt: data.expiresAt ? data.expiresAt.toISOString() : undefined,
        visibility: "draft" as const,
      };
      setIsSubmitting(true);
      try {
        await createFormMutation.mutateAsync(payload);
        reset(data);
        toast.success("Draft saved!");
        setTimeout(() => {
          router.push("/form/draft");
        }, 300);
      } catch (error) {
        toast.error("Failed to save draft", {
          description: "Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }),
    [handleSubmit, reset, router, createFormMutation]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle radial gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(226,255,50,0.05),transparent)]" />

      {/* Sticky header */}
      <FormPageHeader
        isSubmitting={isSubmitting}
        isDirty={isDirty}
        onSaveDraft={handleSaveDraft}
      />

      {/* Main layout */}
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_340px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left column — form sections */}
        <div className="space-y-5">
          <motion.div variants={itemVariants}>
            <FormBasicsSection form={form} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormSettingsSection form={form} />
          </motion.div>
        </div>

        {/* Right column — live preview */}
        <motion.div variants={itemVariants} className="hidden lg:block">
          <FormPreviewCard values={values} />
        </motion.div>
      </motion.div>
    </div>
  );
}
