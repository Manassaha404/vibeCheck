"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  MoreHorizontal,
  Settings,
  Globe,
  Link2,
  FileEdit,
  LayoutGrid,
  Plus,
  Loader2,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { trpc } from "../../trpc/client";
import PageLoader from "../PageLoader";

type VisibilityFilter = "all" | "public" | "unlisted" | "draft";

const filterOptions: {
  id: VisibilityFilter;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "all", label: "All Forms", icon: LayoutGrid },
  { id: "public", label: "Public", icon: Globe },
  { id: "unlisted", label: "Unlisted", icon: Link2 },
  { id: "draft", label: "Drafts", icon: FileEdit },
];

const visibilityStyles: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    icon: React.ElementType;
    beamColor: string;
  }
> = {
  public: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
    icon: Globe,
    beamColor: "via-emerald-500",
  },
  unlisted: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
    icon: Link2,
    beamColor: "via-amber-500",
  },
  draft: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-500 dark:text-zinc-400",
    border: "border-zinc-500/20",
    dot: "bg-zinc-400",
    icon: FileEdit,
    beamColor: "via-zinc-400",
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export function FormGrid() {
  const router = useRouter();
  const [filter, setFilter] = useState<VisibilityFilter>("all");

  const { data, isLoading, isError } = trpc.form.getAllCreatedForms.useQuery(
    undefined,
    {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const forms = data?.forms || [];

  // Handle Filtering safely
  const filteredForms = (forms || []).filter((form) =>
    filter === "all" ? true : form.visibility === filter,
  );

  if (isLoading) {
    return <PageLoader />;
  }

  // Error State fallback
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

  // 2. Master Empty State (User has absolutely 0 forms)
  if (forms?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background/50 text-center backdrop-blur-sm"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground">
          Create your first form
        </h2>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          You don't have any forms yet. Start building your first VibeCheck form
          to collect responses effortlessly.
        </p>
        <Button
          onClick={() => router.push("/builder")}
          className="h-11 rounded-full px-8 font-medium shadow-lg transition-all hover:scale-105 hover:shadow-primary/25"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Form
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* FILTER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex h-10 items-center rounded-xl border border-border/60 bg-muted/40 p-1">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isActive = filter === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`relative inline-flex h-8 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeFilter"
                    className="absolute inset-0 rounded-lg bg-background shadow-sm ring-1 ring-border/60"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-4 w-4 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span className="relative z-10">{option.label}</span>
              </button>
            );
          })}
        </div>

        <p className="text-xs font-medium text-muted-foreground">
          {filteredForms.length} {filteredForms.length === 1 ? "form" : "forms"}
        </p>
      </div>

      {/* GRID */}
      <AnimatePresence mode="wait">
        {filteredForms.length > 0 ? (
          <motion.div
            key={filter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredForms.map((form) => {
              const style =
                visibilityStyles[form.visibility] ?? visibilityStyles["draft"];
              const BadgeIcon = style?.icon || Globe;

              return (
                <motion.div
                  key={form.id}
                  layout="position"
                  variants={cardVariants as any}
                  className="h-full"
                >
                  <Card className="group relative flex h-full min-h-[220px] flex-col overflow-hidden border border-border/50 bg-background/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg hover:shadow-black/[0.04]">
                    {/* HEADER */}
                    <CardHeader className="pb-3 pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="h-[48px] overflow-hidden">
                            <h3 className="line-clamp-2 text-sm font-semibold leading-6 tracking-[-0.01em] text-foreground">
                              {form.title}
                            </h3>
                          </div>
                          <div className="mt-1 h-[16px]">
                            <p className="text-[11px] text-muted-foreground/70">
                              Updated{" "}
                              {new Date(
                                form.updatedAt as any,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardHeader>

                    {/* CONTENT */}
                    <CardContent className="flex-1 pb-4">
                      <span
                        className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium capitalize ${style?.bg} ${style?.text} ${style?.border}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${style?.dot}`}
                        />
                        <BadgeIcon className="h-3 w-3" />
                        {form.visibility}
                      </span>
                    </CardContent>

                    {/* FOOTER */}
                    <CardFooter className="mt-auto flex h-[56px] items-center justify-between border-t border-border/50 pt-0">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <BarChart2 className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium tabular-nums">
                          {/* 🚀 Ensure responseLimit or response count is derived safely */}
                          {form.responseLimit || 0}
                          <span className="ml-1 font-normal opacity-60">
                            responses
                          </span>
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/builder/${form.id}`)}
                        className="h-8 gap-1.5 rounded-lg px-3 text-[11px] text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </CardFooter>

                    {/* BORDER BEAM — only visible on hover */}
                    <BorderBeam
                      duration={6}
                      size={300}
                      className={`opacity-0 transition-opacity duration-300 group-hover:opacity-100 from-transparent ${style?.beamColor} to-transparent`}
                    />
                    <BorderBeam
                      duration={6}
                      delay={3}
                      size={300}
                      borderWidth={1.5}
                      className={`opacity-0 transition-opacity duration-300 group-hover:opacity-100 from-transparent ${style?.beamColor} to-transparent`}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty-filter"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-muted/10 py-16 text-center"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/60">
              <LayoutGrid className="h-5 w-5 text-muted-foreground/60" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              No forms found
            </h3>
            <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed text-muted-foreground/70">
              No{" "}
              <span className="font-medium capitalize text-muted-foreground">
                {filter}
              </span>{" "}
              forms yet. Create or update one to see it here.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
