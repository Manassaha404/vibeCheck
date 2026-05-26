"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowLeft, Save, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldRenderer } from "./field-renderer";
import { containerVariants, itemVariants } from "./constants";
import { trpc } from "@/trpc/client";


export function EditResponseContainer({ formId }: { formId: string }) {
  const router = useRouter();

  const { data: form, isLoading: isFormLoading, error: formError } =
    trpc.form.getFormDataForSubmitForm.useQuery({ formId });

  const { data: submissionStatus, isLoading: isStatusLoading } =
    trpc.form.isAlreadySubmited.useQuery({ formId });

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (submissionStatus && 'answers' in submissionStatus && submissionStatus.answers.length > 0) {
      const initialAnswers: Record<string, any> = {};
      submissionStatus.answers.forEach((a) => {
        try {
          initialAnswers[a.fieldId] = JSON.parse(a.value);
        } catch {
          initialAnswers[a.fieldId] = a.value;
        }
      });
      setAnswers(initialAnswers);
    }
  }, [submissionStatus]);

  const updateMutation = trpc.form.updateFormResponse.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      setIsSuccess(true);
    },
    onError: (err) => {
      setIsSubmitting(false);
      alert("Error updating response: " + err.message);
    },
  });

  const handleFieldChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields = form!.fields.filter((field) => {
      if (!field.required) return false;
      const val = answers[field.id];
      if (val === undefined || val === null || val === "") return true;
      if (Array.isArray(val) && val.length === 0) return true;
      return false;
    });

    if (missingFields.length > 0) {
      alert("Please fill all required fields before saving.");
      return;
    }

    setIsSubmitting(true);
    const formattedAnswers = Object.entries(answers)
      .filter(([_, value]) => value !== undefined && value !== null && value !== "" && (!Array.isArray(value) || value.length > 0))
      .map(([fieldId, value]) => ({
        fieldId,
        value: typeof value === "object" ? JSON.stringify(value) : String(value),
      }));

    updateMutation.mutate({
      formId: form!.id,
      answers: formattedAnswers,
    });
  };


  if (isFormLoading || isStatusLoading) {
    return (
      <div className="flex justify-center items-center h-64 gap-3 text-muted-foreground">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Loading your response...
      </div>
    );
  }

  if (formError || !form) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-2 text-red-500">
        <AlertCircle className="w-8 h-8" />
        <p>Error loading form. Please try again.</p>
      </div>
    );
  }

  if (!form.allowResponseEdit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Editing not allowed</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          The form owner has disabled response editing for this form.
        </p>
        <Button variant="ghost" onClick={() => router.push(`/form/submit/${formId}`)} className="gap-2 mt-2">
          <ArrowLeft className="w-4 h-4" />
          Go back
        </Button>
      </div>
    );
  }

  if (!submissionStatus?.isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">No response found</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          You haven&apos;t submitted a response yet. Go back to fill out the form.
        </p>
        <Button variant="ghost" onClick={() => router.push(`/form/submit/${formId}`)} className="gap-2 mt-2">
          <ArrowLeft className="w-4 h-4" />
          Go to form
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Response Updated!</h2>
        <p className="text-muted-foreground text-lg max-w-md mb-8">
          Your response has been updated successfully.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(`/form/submit/${formId}`)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to form
        </Button>
      </motion.div>
    );
  }
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto pb-24"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/form/submit/${formId}`)}
          className="gap-2 text-muted-foreground hover:text-foreground mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-start gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Editing your response
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3 leading-tight">
              {form.title}
            </h1>
            {form.description && (
              <p className="text-lg text-muted-foreground max-w-2xl">{form.description}</p>
            )}
          </div>
        </div>
      </motion.div>
      <form onSubmit={handleSubmit}>
        <AnimatePresence>
          {form.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={answers[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
          ))}
        </AnimatePresence>
        <motion.div variants={itemVariants} className="mt-12 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/form/submit/${formId}`)}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 px-8 text-lg font-medium shadow-[0_0_40px_rgba(226,255,50,0.3)] hover:shadow-[0_0_60px_rgba(226,255,50,0.5)] transition-all duration-300 gap-3"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Save Changes
                <Save className="w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
