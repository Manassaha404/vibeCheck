"use client";

import { useEffect } from "react";
import {
  Controller,
  type UseFormReturn,
  useWatch,
} from "react-hook-form";
import { FileText, Link, AlignLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CreateFormValues } from "./types";
import { cn } from "@/lib/utils";

interface FormBasicsSectionProps {
  form: UseFormReturn<CreateFormValues>;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150);
}

export function FormBasicsSection({ form }: FormBasicsSectionProps) {
  const { control, formState: { errors }, setValue } = form;
  const title = useWatch({ control, name: "title" });
  useEffect(() => {
    if (title) {
      setValue("slug", slugify(title), { shouldValidate: false });
    }
  }, [title, setValue]);

  return (
    <Card className="border-border/50 bg-card/60 shadow-sm backdrop-blur-sm">
      <CardHeader className="pb-4 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Basic Information
            </h2>
            <p className="text-xs text-muted-foreground">
              Set your form&apos;s title, slug and description
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pb-6">
        {/* Title */}
        <div className="space-y-1.5">
          <Label
            htmlFor="title"
            className="text-xs font-medium text-foreground"
          >
            Form Title
            <span className="ml-1 text-destructive">*</span>
          </Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                id="title"
                placeholder="e.g. Customer Feedback Survey"
                className={cn(
                  "h-10 rounded-xl text-sm",
                  errors.title &&
                    "border-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
                {...field}
              />
            )}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <Label
            htmlFor="slug"
            className="text-xs font-medium text-foreground"
          >
            URL Slug
            <span className="ml-1 text-destructive">*</span>
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Link className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <Input
                  id="slug"
                  placeholder="my-awesome-form"
                  className={cn(
                    "h-10 rounded-xl pl-8 font-mono text-sm",
                    errors.slug &&
                      "border-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive/20"
                  )}
                  {...field}
                  onChange={(e) =>
                    field.onChange(slugify(e.target.value))
                  }
                />
              )}
            />
          </div>
          <p className="text-[11px] text-muted-foreground/70">
            Auto-generated from title. You can customize it.
          </p>
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label
            htmlFor="description"
            className="flex items-center gap-1.5 text-xs font-medium text-foreground"
          >
            <AlignLeft className="h-3 w-3 text-muted-foreground" />
            Description
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Briefly describe what this form is about..."
                rows={3}
                className="resize-none rounded-xl text-sm leading-relaxed"
                {...field}
              />
            )}
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
