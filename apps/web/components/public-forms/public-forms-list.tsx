"use client";

import { motion } from "framer-motion";
import { Loader2, SearchX } from "lucide-react";
import { trpc } from "@/trpc/client";
import { PublicFormCard, PublicForm } from "./public-form-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function PublicFormsList() {
  const { data, isLoading, isError } = trpc.form.getAllPublicForms.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50 mb-4" />
        <p className="text-muted-foreground font-medium">Discovering forms...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh] text-destructive">
        <p className="text-lg font-medium bg-destructive/10 px-4 py-2 rounded-lg">
          Failed to load public forms. Please try again later.
        </p>
      </div>
    );
  }

  const forms = data?.forms || [];

  if (forms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="bg-muted/30 p-6 rounded-full mb-6">
          <SearchX className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">No public forms found</h3>
        <p className="text-muted-foreground max-w-sm">
          It looks like there aren't any public forms available right now. Check back later!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {forms.map((form: any) => (
        <motion.div key={form.id} variants={itemVariants} className="h-full">
          <PublicFormCard form={form} />
        </motion.div>
      ))}
    </motion.div>
  );
}
