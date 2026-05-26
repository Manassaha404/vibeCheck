"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FormPageHeaderProps {
  isSubmitting: boolean;
  isDirty: boolean;
  onSaveDraft: () => void;
}

export function FormPageHeader({
  isSubmitting,
  isDirty,
  onSaveDraft,
}: FormPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Left — Back + Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              Create Form
            </h1>
            {isDirty && (
              <Badge
                variant="secondary"
                className="h-5 rounded-md px-1.5 text-[10px] font-medium text-muted-foreground"
              >
                Unsaved
              </Badge>
            )}
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={isSubmitting}
          onClick={onSaveDraft}
          className="h-8 gap-1.5 rounded-lg text-xs font-semibold"
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save Draft
        </Button>
      </div>
    </div>
  );
}
