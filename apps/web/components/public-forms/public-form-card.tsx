"use client";

import { motion } from "framer-motion";
import { Lock, Unlock, BarChart2, Calendar, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface PublicForm {
  id: string;
  title: string;
  description: string | null;
  passwordNeeded: boolean;
  totalResponses: number;
  responseLimit: number | null;
  createdAt: string | Date;
}

interface PublicFormCardProps {
  form: PublicForm;
}

export function PublicFormCard({ form }: PublicFormCardProps) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="group relative flex h-full flex-col overflow-hidden border border-border/50 bg-background/80 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="line-clamp-1 text-base font-semibold text-foreground">
                  {form.title}
                </h3>
              </div>
              {form.description ? (
                <p className="line-clamp-2 text-xs text-muted-foreground/80 mt-1">
                  {form.description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground/50 italic mt-1">
                  No description provided.
                </p>
              )}
            </div>
            
            {/* Password Indicator */}
            {form.passwordNeeded ? (
              <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-500 shrink-0">
                <Lock className="h-3 w-3" />
                Protected
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-medium text-green-500 shrink-0">
                <Unlock className="h-3 w-3" />
                Public
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 pb-2">
          <div className="mt-2 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-3.5 w-3.5 opacity-70" />
              <span>
                {form.totalResponses} {form.totalResponses === 1 ? 'Response' : 'Responses'}
                {form.responseLimit ? ` / ${form.responseLimit}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 opacity-70" />
              <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 pb-4 border-t border-border/50 bg-muted/20">
          <Button 
            className="w-full" 
            variant="default"
            onClick={() => router.push(`/form/submit/${form.id}`)}
          >
            Participate
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
