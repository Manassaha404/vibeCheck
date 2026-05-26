"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Send, Trash2, Edit, AlertCircle, XCircle, TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordProtection } from "./password-protection";
import { FieldRenderer } from "./field-renderer";
import { containerVariants, itemVariants } from "./constants";
import { trpc } from "@/trpc/client";
import PageLoader from "../PageLoader";


function AlertBanner({
  variant,
  message,
  onDismiss,
}: {
  variant: "error" | "warning" | "info";
  message: string;
  onDismiss?: () => void;
}) {
  const styles = {
    error:   "bg-destructive/10 border-destructive/30 text-destructive",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
    info:    "bg-primary/10 border-primary/30 text-primary",
  };
  const Icon = variant === "error" ? XCircle : TriangleAlert;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm mb-6 ${styles[variant]}`}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="opacity-60 hover:opacity-100 transition-opacity">
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}



export function FormContainer({ formId }: { formId: string }) {
  const router = useRouter();
  const utils  = trpc.useUtils();

  const { data: form, isLoading: isFormLoading, error: formError, refetch: refetchForm } =
    trpc.form.getFormDataForSubmitForm.useQuery({ formId });

  const {
    data: submissionStatus,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = trpc.form.isAlreadySubmited.useQuery({ formId });

  const [isUnlocked,   setIsUnlocked]   = useState(false);
  const [answers,      setAnswers]       = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting]  = useState(false);
  const [isSuccess,    setIsSuccess]     = useState(false);
  const [formError2,   setFormError2]    = useState<string | null>(null);


  const submitMutation = trpc.form.submitFormResponse.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      setIsSuccess(true);
      refetchStatus();
      refetchForm(); 
    },
    onError: (err) => {
      setIsSubmitting(false);
      setFormError2(err.message);
    },
  });

  
  const deleteMutation = trpc.form.deleteFormResponse.useMutation({
    onSuccess: () => {
      setAnswers({});
      setFormError2(null);
      refetchStatus(); 
      refetchForm();   
    },
    onError: (err) => setFormError2(err.message),
  });

  
  const handleUnlock = async (password: string) => {
    try {
      const isValid = await utils.form.checkFormPassword.fetch({ formId, password });
      if (isValid) { setIsUnlocked(true); return true; }
      return false;
    } catch { return false; }
  };

  const handleFieldChange = (fieldId: string, value: any) =>
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError2(null);

    const missingFields = form!.fields.filter((field) => {
      if (!field.required) return false;
      const val = answers[field.id];
      if (val === undefined || val === null || val === "") return true;
      if (Array.isArray(val) && val.length === 0) return true;
      return false;
    });

    if (missingFields.length > 0) {
      setFormError2(
        `Please fill in: ${missingFields.map((f) => f.label).join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);
    const formattedAnswers = Object.entries(answers)
      .filter(([_, v]) => v !== undefined && v !== null && v !== "" && (!Array.isArray(v) || v.length > 0))
      .map(([fieldId, value]) => ({
        fieldId,
        value: typeof value === "object" ? JSON.stringify(value) : String(value),
      }));

    submitMutation.mutate({ formId: form!.id, answers: formattedAnswers });
  };

  const handleDeleteResponse = () => {
    setFormError2(null);
    deleteMutation.mutate({ formId });
  };

 
  if (isFormLoading || isStatusLoading) {
    return (
      <PageLoader/>
    );
  }

  if (formError || !form) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-2 text-destructive">
        <AlertCircle className="w-8 h-8" />
        <p className="text-sm">Error loading form. Please refresh the page.</p>
      </div>
    );
  }


  if (form.passwordNeeded && !isUnlocked) {
    return <PasswordProtection onUnlock={handleUnlock} formTitle={form.title} />;
  }

  if (form.responseLimitReached && !submissionStatus?.isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <Card className="max-w-md w-full border-border shadow-2xl backdrop-blur-xl bg-card/60">
          <CardHeader className="pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto bg-yellow-500/15 rounded-full flex items-center justify-center mb-4"
            >
              <TriangleAlert className="w-8 h-8 text-yellow-500" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Responses Closed</CardTitle>
            <CardDescription>
              This form has reached its maximum number of responses (
              {form.responseLimit}) and is no longer accepting new submissions.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }


  if (submissionStatus?.isSubmitted && !isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <Card className="max-w-md w-full border-border shadow-2xl backdrop-blur-xl bg-card/60">
          <CardHeader className="pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Already Submitted</CardTitle>
            <CardDescription className="text-sm">
              You have already responded to{" "}
              <span className="font-semibold text-foreground">{form.title}</span>.{" "}
              {form.allowResponseEdit
                ? "You can edit your existing response or delete it entirely."
                : "The form owner has disabled editing of responses."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pb-6">
            {/* Inline error if delete fails */}
            <AnimatePresence>
              {formError2 && (
                <AlertBanner
                  variant="error"
                  message={formError2}
                  onDismiss={() => setFormError2(null)}
                />
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="destructive"
                className="gap-2"
                onClick={handleDeleteResponse}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete Response
              </Button>

              {form.allowResponseEdit && (
                <Button
                  variant="default"
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => router.push(`/form/submit/${formId}/edit`)}
                >
                  <Edit className="w-4 h-4" />
                  Edit Response
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
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
        <h2 className="text-3xl font-bold text-foreground mb-4">Thank you!</h2>
        <p className="text-muted-foreground text-lg max-w-md">
          Your response has been recorded successfully.
        </p>
      </motion.div>
    );
  }

  // ── Form fill ─────────────────────────────────────────────────────────────
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto pb-24"
    >
      <motion.div variants={itemVariants} className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
          {form.title}
        </h1>
        {form.description && (
          <p className="text-lg text-muted-foreground max-w-2xl">{form.description}</p>
        )}
      </motion.div>

      <AnimatePresence>
        {formError2 && (
          <AlertBanner
            variant="error"
            message={formError2}
            onDismiss={() => setFormError2(null)}
          />
        )}
      </AnimatePresence>

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

        <motion.div variants={itemVariants} className="mt-12 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 px-8 text-lg font-medium shadow-[0_0_40px_rgba(226,255,50,0.3)] hover:shadow-[0_0_60px_rgba(226,255,50,0.5)] transition-all duration-300 gap-3"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Submit Response
                <Send className="w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
